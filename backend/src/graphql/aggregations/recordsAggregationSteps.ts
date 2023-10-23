import { NexusGenObjects } from "../../../nexus-typegen";
import { records } from "../../database";

const dayBeginningISO = () => {
  const startOfSelectedDay = new Date().setHours(0, 0, 0, 0);
  return new Date(startOfSelectedDay).toISOString();
};

const monthBoundariesISO = (selectedDate: string) => {
  const correctTS = new Date(selectedDate);

  const monthStart = new Date(correctTS.getFullYear(), correctTS.getMonth(), 1);
  const monthEnd = new Date(correctTS.getFullYear(), correctTS.getMonth() + 1);
  return {
    monthStart: monthStart.toISOString(),
    monthEnd: monthEnd.toISOString(),
  };
};

const daily = async () => {
  const recsFetched = await records
    .find({
      date: { $gte: dayBeginningISO() },
    })
    .toArray();

  return recsFetched;
};

const monthly = async (selectedDate: string) => {
  const { monthStart, monthEnd } = monthBoundariesISO(selectedDate);
  const recsFetched = await records
    .aggregate([
      {
        $match: {
          $and: [{ date: { $gte: monthStart } }, { date: { $lt: monthEnd } }],
        },
      },
      {
        $group: {
          _id: "$login",
          brk_hrs: { $sum: "$brk_hrs" },
          wrk_hrs: { $sum: "$wrk_hrs" },
        },
      },
      { $project: { login: "$_id", wrk_hrs: "$wrk_hrs", brk_hrs: "$brk_hrs" } },
    ])
    .toArray();

  return recsFetched;
};

const loadForSet = async (login: string) => {
  const recFound = await records.findOne({
    $and: [{ login: login }, { date: { $gte: dayBeginningISO() } }],
  });

  new Date();
  return recFound;
};

const start = async (login: string) => {
  let pipelineArg = {};
  let recCheck = await records.findOne({
    $and: [{ login: login }, { date: { $gte: dayBeginningISO() } }],
  });

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
  }
  return pipelineArg ? pipelineArg : {};
};

const goHome = async (login: string) => {
  await records
    .aggregate([
      {
        $match: {
          $and: [{ login: login }, { date: { $gte: dayBeginningISO() } }],
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
                    $divide: [{ $subtract: [new Date(), "$start"] }, 3600000],
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
};

const startBreak = async () => {
  const pipelineArg = {
    $set: {
      cfbreak: new Date(),
    },
  };
  return pipelineArg;
};

const finishBreak = async (login: string) => {
  await records
    .aggregate([
      {
        $match: {
          $and: [{ login: login }, { date: { $gte: dayBeginningISO() } }],
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
                    $divide: [{ $subtract: [new Date(), "$cfbreak"] }, 3600000],
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
};

const recordsAggregations = {
  recordsDaily: daily,
  recordsMonthly: monthly,
  loadRecordForSet: loadForSet,

  recordSet: {
    recordStart: start,
    recordGoHome: goHome,
    recordStartBreak: startBreak,
    recordFinishBreak: finishBreak,
  },
};

export default recordsAggregations;
