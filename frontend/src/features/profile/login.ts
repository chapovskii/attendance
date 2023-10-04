import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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
  console.log(process.env.API);
  return response.data.data.login;
});

const profileLoginSlice = createSlice({
  name: "profileLogin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecords.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRecords.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.response = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchRecords.rejected, (state, action) => {
      state.loading = false;
      state.response = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default profileLoginSlice.reducer;
