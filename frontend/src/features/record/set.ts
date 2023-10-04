import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Record } from "./daily";

type InitialState = {
  loading: boolean;
  records: Record[];
  error: string;
};
const initialState: InitialState = {
  loading: false,
  records: [],
  error: "",
};

// Generates pending, fulfilled and rejected action types
export const fetchRecordsMonthly = createAsyncThunk(
  "record/daily",
  async (arg: { login: string; process: string }) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
        mutation SetRecord($login: String!, $process: String!) {
            setRecord(login: $login, process: $process)
          }
          `,
        variables: arg,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(process.env.API);
    return response.data.data.monthlyRecords;
  }
);

const recordMonthlySlice = createSlice({
  name: "recordMonthly",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecordsMonthly.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRecordsMonthly.fulfilled,
      (state, action: PayloadAction<Record[]>) => {
        state.loading = false;
        state.records = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchRecordsMonthly.rejected, (state, action) => {
      state.loading = false;
      state.records = [];
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default recordMonthlySlice.reducer;
