import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Record } from "./daily";

export type extendedRecord = Record & { date: Date };

type issues = {
  fix_required: extendedRecord[];
  suspicious: extendedRecord[];
};

type InitialState = {
  loading: boolean;
  issues: issues;
  error: string;
};
const initialState: InitialState = {
  loading: false,
  issues: {
    fix_required: [],
    suspicious: [],
  },
  error: "",
};

export const fetchIssues = createAsyncThunk("record/issues", async () => {
  const response = await axios.post(
    `http://localhost:8000/graphql`,
    {
      query: `
        query RecordsIssues {
          recordsIssues {
            fix_required {
              login
              date
              start
              end
              status
              brk_hrs
              wrk_hrs
              cfbreak
              name
            }
            suspicious {
              login
              date
              start
              end
              status
              brk_hrs
              wrk_hrs
              cfbreak
              name
            }
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

  return response.data.data.recordsIssues;
});

const recordsIssueslice = createSlice({
  name: "recordsIssues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchIssues.fulfilled,
      (state, action: PayloadAction<issues>) => {
        state.loading = false;
        state.issues = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchIssues.rejected, (state, action) => {
      state.loading = false;
      state.issues = {
        fix_required: [],
        suspicious: [],
      };
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default recordsIssueslice.reducer;
