import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { profiles } from "../database";

export const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.nonNull.string("login");
    t.nonNull.string("name");
    t.nonNull.string("position");
    t.nonNull.string("email");
    t.nonNull.string("phone");
  },
});

export const ProfileQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("login", {
      type: "Boolean",
      args: {
        login: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const accountFound = await profiles.findOne({ login: args.login });

        const response = accountFound ? true : false;
        return response;
      },
    });
  },
});

export const ProfileMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProfile", {
      type: "Profile",
      args: {
        login: nonNull(stringArg()),
        name: nonNull(stringArg()),
        position: nonNull(stringArg()),
        email: nonNull(stringArg()),
        phone: nonNull(stringArg()),
      },

      async resolve(parent, args, context, info) {
        const { login, name, position, email, phone } = args;
        const newProfile: NexusGenObjects["Profile"] = {
          login,
          name,
          position,
          email,
          phone,
        };

        await profiles.insertOne(newProfile);

        return newProfile;
      },
    });
  },
});
