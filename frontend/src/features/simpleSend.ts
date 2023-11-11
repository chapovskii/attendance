import axios from "axios";
import { Profile } from "./profile/login";

const correctRecord = async (props: {
  login: string;
  date: string;
  value: number;
}) => {
  await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
      mutation CorrectRecord($login: String!, $date: String!, $value: Int!) {
        correctRecord(login: $login, date: $date, value: $value)
      }
                    `,
      variables: props,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return true;
};

const updateUser = async (args: Profile) => {
  await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
      mutation UpdateProfile($login: String!, $name: String!, $position: String!, $email: String!, $phone: String!, $adminRole: Boolean!) {
        updateProfile(login: $login, name: $name, position: $position, email: $email, phone: $phone, adminRole: $adminRole)
      }
                    `,
      variables: args,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const deleteUser = async (login: string) => {
  await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
      mutation DeleteProfile($login: String!) {
        deleteProfile(login: $login)
      }
                    `,
      variables: { login },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const createProfile = async (data: Profile) => {
  await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
          mutation CreateProfile($login: String!, $name: String!, $position: String!, $email: String!, $phone: String!, $adminRole: Boolean!) {
            createProfile(login: $login, name: $name, position: $position, email: $email, phone: $phone, adminRole: $adminRole)
          }
              `,
      variables: data,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const simpleRequest = {
  record: { correctRecord },
  profile: { updateUser, deleteUser, createProfile },
};

export default simpleRequest;
