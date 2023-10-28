import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
  email: string;
  login: string;
  name: string;
  phone: string;
  position: string;
  adminRole: boolean;
};

type InitialState = {
  loading: boolean;
  response: Profile[];
  error: string;
};

const initialState: InitialState = {
  loading: false,
  response: [],
  error: "",
};

// Generates pending, fulfilled and rejected action types
export const userList = createAsyncThunk(
  "profile/list",
  async (login: string) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
        query UserList($login: String!) {
            userList(login: $login) {
              login
              name
              position
              email
              phone
              adminRole
            }
          }
          `,
        variables: {
          login: login,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.data);

    return response.data.data.userList;
  }
);

const profileLoginSlice = createSlice({
  name: "profileList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      userList.fulfilled,
      (state, action: PayloadAction<Profile[]>) => {
        state.loading = false;
        state.response = action.payload;
        state.error = "";
      }
    );
    builder.addCase(userList.rejected, (state, action) => {
      state.loading = false;
      state.response = [];
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default profileLoginSlice.reducer;
