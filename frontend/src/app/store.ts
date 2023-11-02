import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import profileAuthReducer from "../features/profile/login";
import recordDailyReducer from "../features/record/daily";
import recordMonthlyReducer from "../features/record/monthly";
import recordSetReducer from "../features/record/set";
import statusSetReducer from "../features/record/status";
import updateUser from "../features/profile/update";
import userList from "../features/profile/profiles";
import issues from "../features/record/issues";

export const store = configureStore({
  reducer: {
    authProfile: profileAuthReducer,
    updateUser: updateUser,
    userList: userList,

    dailyRecords: recordDailyReducer,
    monthlyRecords: recordMonthlyReducer,
    setRecord: recordSetReducer,
    recordStatus: statusSetReducer,
    foundIssues: issues,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
