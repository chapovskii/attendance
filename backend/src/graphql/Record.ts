import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { profiles, records } from "../database";
import { WithId } from "mongodb";
import recordsAggregations from "./aggregations/recordsAggregationSteps";
import profilesAggregations from "./aggregations/profilesAggregationSteps";

export const Record = objectType({
  name: "Record",
  definition(t) {
    t.nonNull.string("login");
    t.nonNull.string("date");
    t.string("start");
    t.string("end");
    t.nonNull.boolean("status");
    t.int("brk_hrs");
    t.int("wrk_hrs");
    t.int("cfbreak");
  },
});
export const RecordWOpt = objectType({
  name: "RecordWOpt",
  definition(t) {
    t.nonNull.field("recordData", {
      type: "Record",
    });
    t.nonNull.string("options");
  },
});

const DocsWOID: (fetchedDocs: any[]) => NexusGenObjects["Record"][] = (
  fetchedDocs
) => {
  const result = fetchedDocs.map((doc) => {
    return {
      date: doc.date || "",
      login: doc.login || "",
      start: doc.start || "",
      brk_hrs: doc.brk_hrs || null,
      wrk_hrs: doc.wrk_hrs || null,
      end: doc.end || "",
      status: doc.status || false,
      cfbreak: doc.cfbreak || null,
    };
  });

  return result;
};

export const RecordQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("dailyRecords", {
      type: "Record",
      async resolve() {
        const recsFound = await recordsAggregations.recordsDaily();
        const returningResp: NexusGenObjects["Record"][] = DocsWOID(recsFound);

        return returningResp;
      },
    });

    t.list.field("monthlyRecords", {
      type: "Record",
      args: {
        date: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { date } = args;

        const recsFound = await recordsAggregations.recordsMonthly(date);
        const returningResp: NexusGenObjects["Record"][] = DocsWOID(recsFound);

        return returningResp;
      },
    });

    t.field("loadRecordForSet", {
      type: "RecordWOpt",
      args: {
        login: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { login } = args;
        const recFound = await recordsAggregations.loadRecordForSet(login);
        let returnValue: { recordData: NexusGenObjects["Record"] } & {
          options: string;
        } = {
          recordData: {
            brk_hrs: 0,
            cfbreak: 0,
            date: "",
            end: "",
            login: "",
            start: "",
            status: false,
            wrk_hrs: 0,
          },
          options: "start",
        };

        const rewriteRecordData = async () => {
          returnValue.recordData = {
            ...returnValue.recordData,
            ...recFound,
          };
        };

        (await profilesAggregations.authentification(login))
          ? await rewriteRecordData()
          : (returnValue.options = "login");

        if (recFound !== null) {
          switch (true) {
            case recFound.status === true && recFound.cfbreak === null:
              returnValue.options = "start break or go home";
              break;
            case recFound.status === true && recFound.cfbreak !== null:
              returnValue.options = "finish break or go home";
              break;
          }
        }

        return returnValue;
      },
    });
  },
});

export const RecordMutation = extendType({
  type: "Mutation",
  definition(rec) {
    rec.nonNull.field("setRecord", {
      type: "Boolean",
      args: {
        login: nonNull(stringArg()),
        process: nonNull(stringArg()),
      },

      async resolve(parent, args, context) {
        const { process, login } = args;
        let pipelineArg = {};
        const startOfSelectedDay = new Date();
        startOfSelectedDay.setHours(0, 0, 0);

        switch (process) {
          case "startDay":
            pipelineArg =
              await recordsAggregations.recordSet.recordStart(login);
          case "goHome":
            await recordsAggregations.recordSet.recordGoHome(login);
            break;
          case "startBreak":
            pipelineArg = {
              $set: {
                cfbreak: new Date(),
              },
            };
            break;
          case "finishBreak":
            await recordsAggregations.recordSet.recordFinishBreak(login);
            break;
          default:
        }

        if (pipelineArg) {
          await records.updateOne(
            { login: login, date: { $gte: startOfSelectedDay } },
            pipelineArg
          );
        }

        return true;
      },
    });
  },
});
