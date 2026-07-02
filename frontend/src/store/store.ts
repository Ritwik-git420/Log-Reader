import { configureStore } from "@reduxjs/toolkit";
import logFileReducer from "./logFileSlice";
import type { LogFileState } from "./logFileSlice";

const LOG_FILE_STATE_KEY = "logFileState";

function isLogFileState(value: unknown): value is LogFileState {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as LogFileState;

	return Array.isArray(state.files);
}

function loadLogFileState(): LogFileState | undefined {
	try {
		const savedState = localStorage.getItem(LOG_FILE_STATE_KEY);

		if (!savedState) {
			return undefined;
		}

		const parsedState: unknown = JSON.parse(savedState);

		return isLogFileState(parsedState) ? parsedState : undefined;
	} catch {
		return undefined;
	}
}

const savedLogFileState = loadLogFileState();

export const store = configureStore({
	reducer: {
		logFile: logFileReducer,
	},
	preloadedState: savedLogFileState
		? {
				logFile: savedLogFileState,
			}
		: undefined,
});

store.subscribe(() => {
	localStorage.setItem(
		LOG_FILE_STATE_KEY,
		JSON.stringify(store.getState().logFile),
	);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
