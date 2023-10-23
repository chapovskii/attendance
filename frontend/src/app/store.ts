import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import profileAuthReducer from "../features/profile/login";
import recordDailyReducer from "../features/record/daily";
import recordMonthlyReducer from "../features/record/monthly";
import recordSetReducer from "../features/record/set";
import statusSetReducer from "../features/record/status";

export const store = configureStore({
  reducer: {
    authProfile: profileAuthReducer,
    dailyRecords: recordDailyReducer,
    monthlyRecords: recordMonthlyReducer,
    setRecord: recordSetReducer,
    recordStatus: statusSetReducer,
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
