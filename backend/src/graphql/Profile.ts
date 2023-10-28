import { booleanArg, extendType, nonNull, objectType, stringArg } from "nexus";
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
    t.nonNull.boolean("adminRole");
  },
});

const DocsWOID: (fetchedDocs: any[]) => NexusGenObjects["Profile"][] = (
  fetchedDocs
) => {
  const result = fetchedDocs.map((doc) => {
    return {
      login: doc.login || "",
      name: doc.name || "",
      position: doc.position || "",
      email: doc.email || "",
      phone: doc.phone || "",
      adminRole: doc.adminRole || false,
    };
  });

  return result;
};

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

    t.list.field("userList", {
      type: "Profile",
      args: {
        login: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const accountsFound = await profilesAggregations.userList(args.login);
        const returningResp: NexusGenObjects["Profile"][] =
          DocsWOID(accountsFound);

        return returningResp;
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
        adminRole: nonNull(booleanArg()),
      },

      async resolve(parent, args) {
        const newProfile = await profilesAggregations.registration(args);
        return newProfile;
      },
    });

    t.nonNull.field("updateProfile", {
      type: "Boolean",
      args: {
        login: nonNull(stringArg()),
        name: nonNull(stringArg()),
        position: nonNull(stringArg()),
        email: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        adminRole: nonNull(booleanArg()),
      },

      async resolve(parent, args) {
        const newProfile = await profilesAggregations.update(args);
        return newProfile;
      },
    });
  },
});
