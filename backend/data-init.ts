import { MongoClient } from "mongodb";
import * as readline from "readline";

require("dotenv").config();

const newProfiles = [
  {
    login: "admin",
    name: "Administrator",
    position: "maintainer",
    email: "admin@support.com",
    phone: "111-222-333",
    adminRole: true,
  },
  {
    login: "jdoe01",
    name: "John Doe",
    position: "developer",
    email: "john.doe@example.com",
    phone: "111-222-333",
    adminRole: false,
  },
  {
    login: "dfhjdu9",
    name: "Jane Doe",
    position: "designer",
    email: "jane.doe@example.com",
    phone: "111-222-334",
    adminRole: false,
  },
  {
    login: "dghgk5",
    name: "Alice Johnson",
    position: "manager",
    email: "alice.johnson@example.com",
    phone: "111-222-335",
    adminRole: false,
  },
  {
    login: "gfbfggd5",
    name: "Bob Smith",
    position: "engineer",
    email: "bob.smith@example.com",
    phone: "111-222-336",
    adminRole: false,
  },
  {
    login: "hsnh5",
    name: "Eva Brown",
    position: "analyst",
    email: "eva.brown@example.com",
    phone: "111-222-337",
    adminRole: false,
  },
  {
    login: "gfn4",
    name: "Chris Williams",
    position: "architect",
    email: "chris.williams@example.com",
    phone: "111-222-338",
    adminRole: false,
  },
  {
    login: "fjfj33",
    name: "Mia Davis",
    position: "scientist",
    email: "mia.davis@example.com",
    phone: "111-222-339",
    adminRole: false,
  },
  {
    login: "fjdg48",
    name: "Jacob Nollan",
    position: "analyst",
    email: "jjacob515151@gmail.com",
    phone: "111-222-340",
    adminRole: false,
  },
  {
    login: "difgh6",
    name: "Alex Turner",
    position: "developer",
    email: "alex.turner@example.com",
    phone: "111-222-341",
    adminRole: false,
  },
  {
    login: "sggga10",
    name: "Sophia Miller",
    position: "designer",
    email: "sophia.miller@example.com",
    phone: "111-222-342",
    adminRole: false,
  },
];

const recordsArray: any = [];

newProfiles.forEach((profile) => {
  const daysAgo = Math.floor(Math.random() * 30) + 1;

  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - daysAgo);

  const startTimestamp = pastDate.getTime();

  const hrsGen = Math.floor(Math.random() * 10 * 3600000);
  const record = {
    login: profile.login,
    start: new Date(startTimestamp),
    date: pastDate,
    cfbreak: null,
    brk_hrs: Math.floor(Math.random() * 3600000),
    wrk_hrs: hrsGen,
    end: new Date(startTimestamp + hrsGen),
    status: Math.random() < 0.1,
  };

  recordsArray.push(record);
});

let uri: string;
if (process.env.MONGO_DB) {
  uri = process.env.MONGO_DB;
} else {
  throw new Error("MONGO_DB environment variable is not set");
}

const DBclient = new MongoClient(uri);
const database = DBclient.db("attendance");
const profiles = database.collection("profiles");
const records = database.collection("records");

const dataIni = async () => {
  const databaseName = "attendance";
  const database = DBclient.db(databaseName);
  await database.dropDatabase();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askUser = async () => {
    return new Promise<void>((resolve) => {
      rl.question(
        'Insert all generated data for testing "Y", or only admin profile "N"?: ',
        async (answer) => {
          if (answer.toLowerCase() === "y") {
            console.log("Preparing DB, inserting all data...");
            await profiles.insertMany(newProfiles);
            await records.insertMany(recordsArray);
            console.log("Data inserted!");
          } else if (answer.toLowerCase() === "n") {
            console.log("Preparing DB, inserting admin profile...");
            await profiles.insertOne({
              login: "admin",
              name: "Administrator",
              position: "maintainer",
              email: "admin@support.com",
              phone: "111-222-333",
              adminRole: true,
            });
          } else {
            console.log("Invalid option. Please enter 'Y' or 'N'.");
            await askUser();
            return;
          }

          rl.close();
          resolve();
        }
      );
    });
  };

  await askUser();

  process.exit(0);
};

dataIni();
