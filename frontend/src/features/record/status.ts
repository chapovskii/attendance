import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Record } from "./daily";

type InitialState = {
  loading: boolean;
  status: { recordData: Record; options: String };
  error: string;
};

const initialState: InitialState = {
  loading: false,
  status: {
    recordData: {
      login: "",
      start: "",
      end: "",
      status: false,
      brk_hrs: 0,
      wrk_hrs: 0,
      cfbreak: 0,
    },
    options: "login",
  },
  error: "",
};

// Generates pending, fulfilled and rejected action types
export const fetchStatus = createAsyncThunk(
  "record/status",
  async (login: string) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
        query LoadRecordForSet($login: String!) {
            loadRecordForSet(login: $login) {
              recordData {
                login
                date
                start
                end
                status
                brk_hrs
                wrk_hrs
                cfbreak
              }
              options
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

    const resp = await response.data.data.loadRecordForSet;

    resp.options !== "login"
      ? localStorage.setItem("login", login)
      : localStorage.removeItem("login");

    return response.data.data.loadRecordForSet;
  }
);

const recordSlice = createSlice({
  name: "status",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchStatus.fulfilled,
      (
        state,
        action: PayloadAction<{ recordData: Record; options: String }>
      ) => {
        state.loading = false;
        state.status = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchStatus.rejected, (state, action) => {
      state.loading = false;
      state.status = {
        recordData: {
          login: "",
          start: "",
          end: "",
          status: false,
          brk_hrs: 0,
          wrk_hrs: 0,
          cfbreak: 0,
        },
        options: "login",
      };
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default recordSlice.reducer;
