import { NexusGenObjects } from "../../../nexus-typegen";
import { records } from "../../database";

type recordDB = {
  login: string;
  status: boolean;
  start: Date;
  cfbreak: Date | null;
  wrk_hrs: 0;
  brk_hrs: 0;
  end: Date | null;
  date: Date;
};

export const dayBeginningISO = () => {
  const startOfSelectedDay = new Date();
  startOfSelectedDay.setHours(0, 0, 0, 0);
  return startOfSelectedDay;
};

const monthBoundariesISO = (selectedDate: string) => {
  const correctTS = new Date(selectedDate);

  const monthStart = new Date(correctTS.getFullYear(), correctTS.getMonth(), 1);
  const monthEnd = new Date(correctTS.getFullYear(), correctTS.getMonth() + 1);
  return {
    monthStart: monthStart,
    monthEnd: monthEnd,
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
  console.log(selectedDate);
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
  return recFound;
};

const start = async (login: string) => {
  let pipelineArg = [{}];
  let recCheck = await records.findOne({
    $and: [{ login: login }, { date: { $gte: dayBeginningISO() } }],
  });

  if (recCheck !== null) {
    pipelineArg = [
      {
        $project: {
          _id: 1,
          login: 1,
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
                    $divide: [{ $subtract: [new Date(), "$end"] }, 3600000],
                  },
                ],
              },
              1,
            ],
          },
        },
      },
      { $set: { status: true } },
    ];
  } else {
    const newRecord: recordDB = {
      login,
      status: true,
      start: new Date(),
      cfbreak: null,
      wrk_hrs: 0,
      brk_hrs: 0,
      end: null,
      date: new Date(),
    };

    const res = await records.insertOne(newRecord);
  }
  return pipelineArg ? pipelineArg : [{}];
};

const goHome = () => {
  return [
    {
      $project: {
        _id: 1,
        login: 1,
        start: 1,
        cfbreak: null,
        date: 1,
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
        end: new Date(),
      },
    },
    { $set: { status: false } },
  ];
};

const startBreak = () => {
  return [
    {
      $set: {
        cfbreak: new Date(),
      },
    },
  ];
};

const finishBreak = () => {
  return [
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
  ];
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
