import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Record = {
  login: string;
  status: boolean;
  wrk_hrs: number;
  brk_hrs: number;
  cfbreak: number;
  end: String;
  start: String;
};
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

export const fetchRecords = createAsyncThunk("record/daily", async () => {
  const response = await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
        query DailyRecords {
            dailyRecords {
              login
              date
              start
              end
              status
              brk_hrs
              wrk_hrs
              cfbreak
            }
          }
          `,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data.dailyRecords;
});

const recordDailySlice = createSlice({
  name: "recordDaily",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecords.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRecords.fulfilled,
      (state, action: PayloadAction<Record[]>) => {
        state.loading = false;
        state.records = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchRecords.rejected, (state, action) => {
      state.loading = false;
      state.records = [];
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default recordDailySlice.reducer;
