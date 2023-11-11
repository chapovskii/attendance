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

  return await profiles.updateOne(
    { login: args.login },
    { $set: newProfileData }
  );
};

const deleteProfile = async (login: string) => {
  return await profiles.deleteOne({ login: login });
};

const userList = async () => {
  const res = await profiles.find().toArray();
  return res;
};

const profilesAggregations = {
  authentification: auth,
  registration: reg,
  update,
  userList: userList,
  deleteProfile,
};

export default profilesAggregations;
