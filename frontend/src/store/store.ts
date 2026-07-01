import { configureStore } from "@reduxjs/toolkit";
import logFileReducer from "./logFileSlice";

export const store = configureStore({
	reducer: {
		logFile: logFileReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
