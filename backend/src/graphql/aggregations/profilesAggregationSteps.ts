import { NexusGenObjects } from "../../../nexus-typegen";
import { profiles } from "../../database";

const auth = async (login: string) => {
  return await profiles.findOne({ login: login });
};

const reg = async (args: NexusGenObjects["Profile"]) => {
  const res = await profiles.insertOne(args);
  return res.acknowledged;
};

const profilesAggregations = {
  authentification: auth,
  refistration: reg,
};

export default profilesAggregations;
