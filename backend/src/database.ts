require("dotenv").config();
import { MongoClient } from "mongodb";

console.log(process.env.MONGO_DB);
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

export { profiles, records };

export async function startDB() {
  await DBclient.connect();
}

startDB().catch(console.dir);
