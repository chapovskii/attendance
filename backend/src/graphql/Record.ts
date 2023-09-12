import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { records } from "../database";
import { WithId } from "mongodb";

export const Record = objectType({
  name: "Record", // <- Name of your type
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
        const startOfSelectedDay = new Date().setHours(0, 0, 0);

        const projection = { _id: 0 };
        const RecsFetched = await records
          .find({
            date: { $gte: startOfSelectedDay },
          })
          .project(projection)
          .toArray();

        const returningResp: NexusGenObjects["Record"][] =
          DocsWOID(RecsFetched);

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
        const correctTS = new Date(date);

        const monthBeggining = new Date(
          correctTS.getFullYear(),
          correctTS.getMonth(),
          1
        );
        const monthEnding = new Date(
          correctTS.getFullYear(),
          correctTS.getMonth() + 1,
          1
        );

        const RecsFetched = await records
          .aggregate([
            {
              $match: {
                $and: [
                  { date: { $gte: monthBeggining } },
                  { date: { $lt: monthEnding } },
                ],
              },
            },
            {
              $group: {
                _id: "$login",
                brk_hrs: { $sum: "$brk_hrs" },
                wrk_hrs: { $sum: "$wrk_hrs" },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray();

        console.log(
          [
            {
              $match: {
                $and: [
                  { date: { $gte: monthBeggining } },
                  { date: { $lt: monthEnding } },
                ],
              },
            },
            {
              $group: {
                _id: "$login",
                brk_hrs: { $sum: "$brk_hrs" },
                wrk_hrs: { $sum: "$wrk_hrs" },
              },
            },
            { $sort: { _id: 1 } },
          ][0].$match?.$and
        );

        const returningResp: NexusGenObjects["Record"][] =
          DocsWOID(RecsFetched);

        return returningResp;
      },
    });

    // t.list.field("loadRecordForSet", {
    //   type: "String",
    //   args: {
    //     login: nonNull(stringArg()),
    //   },
    //   async resolve(parent, args, context) {
    //     const { login } = args;
    //     const startOfSelectedDay = new Date();
    //     startOfSelectedDay.setHours(0, 0, 0);

    //     const recFound = await records.findOne({
    //       $and: [{ login: login }, { date: { $gte: startOfSelectedDay } }],
    //     });
    //     let returnValue = "start";
    //     if (recFound !== null) {
    //       switch (true) {
    //         case recFound.status === true && recFound.cfbreak === null:
    //           returnValue = "start break or go home";
    //           break;
    //         case recFound.status === true && recFound.cfbreak !== null:
    //           returnValue = "finish break or go home";
    //           break;
    //       }
    //     }

    //     return returnValue;
    //   },
    // });
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
            let recCheck = await records.findOne({
              $and: [{ login: login }, { date: { $gte: startOfSelectedDay } }],
            });

            console.log(recCheck);
            if (recCheck !== null) {
              pipelineArg = { $set: { status: true, start: new Date() } };
            } else {
              const newRecord: NexusGenObjects["Record"] = {
                login,
                status: true,
                start: new Date().toISOString(),
                cfbreak: null,
                wrk_hrs: 0,
                brk_hrs: 0,
                end: null,
                date: new Date().toISOString(),
              };

              const res = await records.insertOne(newRecord);
              console.log(res);
            }

            break;
          case "goHome":
            await records
              .aggregate([
                {
                  $match: {
                    $and: [
                      { login: login },
                      { date: { $gte: startOfSelectedDay } },
                    ],
                  },
                },
                {
                  $set: {
                    brk_hrs: {
                      $cond: {
                        if: { $eq: ["$cfbreak", null] },
                        then: "$brk_hrs",
                        else: {
                          $round: [
                            {
                              $add: [
                                "$brk_hrs",
                                {
                                  $divide: [
                                    { $subtract: [new Date(), "$cfbreak"] },
                                    3600000,
                                  ],
                                },
                              ],
                            },
                            1,
                          ],
                        },
                      },
                    },
                    wrk_hrs: {
                      $round: [
                        {
                          $add: [
                            "$wrk_hrs",
                            {
                              $divide: [
                                { $subtract: [new Date(), "$start"] },
                                3600000,
                              ],
                            },
                          ],
                        },
                        1,
                      ],
                    },
                    status: false,
                    end: new Date(),
                  },
                },
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
            break;
          case "startPause":
            pipelineArg = {
              $set: {
                cfbreak: new Date(),
              },
            };
            break;
          case "finishPause":
            await records
              .aggregate([
                {
                  $match: {
                    $and: [
                      { login: login },
                      { date: { $gte: startOfSelectedDay } },
                    ],
                  },
                },
                {
                  $project: {
                    _id: 1,
                    login: 1,
                    status: 1,
                    start: 1,
                    cfbreak: null,
                    wrk_hrs: 1,
                    end: 1,
                    date: 1,
                    brk_hrs: {
                      $round: [
                        {
                          $add: [
                            "$brk_hrs",
                            {
                              $divide: [
                                { $subtract: [new Date(), "$cfbreak"] },
                                3600000,
                              ],
                            },
                          ],
                        },
                        1,
                      ],
                    },
                  },
                },
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

            break;
          default:
        }

        if (process !== "goHome" && process !== "finishPause") {
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
