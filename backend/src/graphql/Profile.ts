import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { profiles } from "../database";
import profilesAggregations from "./aggregations/profilesAggregationSteps";

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
        const accountFound = await profilesAggregations.authentification(
          args.login
        );
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
      type: "Boolean",
      args: {
        login: nonNull(stringArg()),
        name: nonNull(stringArg()),
        position: nonNull(stringArg()),
        email: nonNull(stringArg()),
        phone: nonNull(stringArg()),
      },

      async resolve(parent, args) {
        const newProfile = await profilesAggregations.refistration(args);
        return newProfile;
      },
    });
  },
});
