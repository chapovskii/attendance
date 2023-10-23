import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
  email: string;
  login: string;
  name: string;
  phone: string;
  position: string;
};

type InitialState = {
  loading: boolean;
  response: boolean;
  error: string;
};

const initialState: InitialState = {
  loading: false,
  response: false,
  error: "",
};

// Generates pending, fulfilled and rejected action types
export const authorize = createAsyncThunk(
  "profile/login",
  async (login: string) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
      query Query($login: String!) {
        login(login: $login)
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
    if (response.data.data.login) {
      localStorage.setItem("login", login);
    }

    return response.data.data;
  }
);

const profileLoginSlice = createSlice({
  name: "profileLogin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authorize.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      authorize.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.response = action.payload;
        state.error = "";
      }
    );
    builder.addCase(authorize.rejected, (state, action) => {
      state.loading = false;
      state.response = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default profileLoginSlice.reducer;
