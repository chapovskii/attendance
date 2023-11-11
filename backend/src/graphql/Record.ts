import {
  booleanArg,
  extendType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { profiles, records } from "../database";
import { WithId } from "mongodb";
import recordsAggregations, {
  dayBeginningISO,
} from "./aggregations/recordsAggregationSteps";
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
    t.string("name");
  },
});

export const RecordsIssues = objectType({
  name: "RecordsIssues",
  definition(t) {
    t.list.field("fix_required", {
      type: "Record",
    });
    t.list.field("suspicious", {
      type: "Record",
    });
  },
});

export const RecordWOpt = objectType({
  name: "RecordWOpt",
  definition(t) {
    t.nonNull.field("recordData", {
      type: "Record",
    });
    t.nonNull.string("options");
    t.nonNull.boolean("adminRole");
  },
});

const formatTime = (timestamp: Date) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const DocsWOID: (fetchedDocs: any[]) => NexusGenObjects["Record"][] = (
  fetchedDocs
) => {
  const result = fetchedDocs.map((doc) => {
    return {
      date: doc.date ? doc.date.toISOString() : "",
      login: doc.login || "",
      start: doc.start ? formatTime(doc.start) : "",
      brk_hrs: doc.brk_hrs || null,
      wrk_hrs: doc.wrk_hrs || null,
      end: doc.end ? formatTime(doc.end) : "",
      status: doc.status || false,
      cfbreak: doc.cfbreak || null,
      name: doc.name || "",
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

    t.field("recordsIssues", {
      type: "RecordsIssues",
      async resolve() {
        const recsFound = await recordsAggregations.recordsIssues();

        const transformedData: NexusGenObjects["RecordsIssues"] = {
          fix_required: DocsWOID(recsFound[0].fix_required || []),
          suspicious: DocsWOID(recsFound[0].suspicious || []),
        };
        return transformedData;
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
        const profile = await profilesAggregations.authentification(login);

        const returnValue = {
          recordData: {
            brk_hrs: recFound?.brk_hrs || 0,
            cfbreak: recFound?.cfbreak || 0,
            date: recFound?.date || "",
            end: recFound?.end || "",
            login: recFound?.login || "",
            start: recFound?.start ? formatTime(recFound.start) : "",
            status: recFound?.status || false,
            wrk_hrs: recFound?.wrk_hrs || 0,
          },
          options: profile ? "start" : "login",
          adminRole: profile?.adminRole || false,
        };

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
        let pipelineArg = [{}];

        switch (process) {
          case "start":
            pipelineArg =
              await recordsAggregations.recordSet.recordStart(login);
            break;
          case "goHome":
            pipelineArg = recordsAggregations.recordSet.recordGoHome();
            break;
          case "startBreak":
            pipelineArg = recordsAggregations.recordSet.recordStartBreak();
            break;
          case "finishBreak":
            pipelineArg = recordsAggregations.recordSet.recordFinishBreak();
            break;
          default:
        }

        if (pipelineArg) {
          await records
            .aggregate([
              {
                $match: {
                  $and: [
                    { login: login },
                    { date: { $gte: new Date(dayBeginningISO()) } },
                  ],
                },
              },
              ...pipelineArg,
              {
                $merge: {
                  into: "records",
                  on: "_id",
                  whenMatched: "replace",
                  whenNotMatched: "fail",
                },
              },
            ])
            .toArray();
        }

        return true;
      },
    });
    rec.nonNull.field("correctRecord", {
      type: "Boolean",
      args: {
        login: nonNull(stringArg()),
        date: nonNull(stringArg()),
        value: nonNull(intArg()),
      },

      async resolve(parent, args, context) {
        const { login, date, value } = args;

        await recordsAggregations.recordCorrect(login, date, value);
        return true;
      },
    });
  },
});
