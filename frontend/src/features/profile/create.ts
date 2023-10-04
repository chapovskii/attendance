import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Profile =
  | {
      email: string;
      login: boolean;
      name: number;
      phone: number;
      position: number;
    }
  | {};
type InitialState = {
  loading: boolean;
  response: Profile;
  error: string;
};
const initialState: InitialState = {
  loading: false,
  response: {},
  error: "",
};

// Generates pending, fulfilled and rejected action types
export const fetchRecords = createAsyncThunk(
  "record/daily",
  async (arg: Profile) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        mutation: `
      mutation CreateProfile($login: String!, $name: String!, $position: String!, $email: String!, $phone: String!) {
        createProfile(login: $login, name: $name, position: $position, email: $email, phone: $phone) {
          login
          name
          position
          email
          phone
        }
      }
          `,
      },
      {
        headers: arg,
      }
    );
    console.log(process.env.API);
    return response.data.data.createProfile;
  }
);

const profileCreateSlice = createSlice({
  name: "profileCreate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecords.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRecords.fulfilled,
      (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.response = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchRecords.rejected, (state, action) => {
      state.loading = false;
      state.response = {};
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default profileCreateSlice.reducer;
