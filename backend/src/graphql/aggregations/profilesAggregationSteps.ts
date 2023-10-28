import { NexusGenObjects } from "../../../nexus-typegen";
import { profiles } from "../../database";

const auth = async (login: string) => {
  return await profiles.findOne({ login: login });
};

const reg = async (args: NexusGenObjects["Profile"]) => {
  const res = await profiles.insertOne(args);
  return res.acknowledged;
};

const update = async (args: NexusGenObjects["Profile"]) => {
  const newProfileData = {
    email: args.email,
    name: args.name,
    phone: args.phone,
    position: args.position,
    adminRole: args.adminRole,
  };

  const res = await profiles.updateOne(
    { login: args.login },
    { $set: newProfileData }
  );
  // todo
  return true;
};

const userList = async (login: string) => {
  // todo: check with login and permition
  const res = await profiles.find().toArray();
  return res;
};

const profilesAggregations = {
  authentification: auth,
  registration: reg,
  update: update,
  userList: userList,
};

export default profilesAggregations;
