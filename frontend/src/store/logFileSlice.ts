import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type LogFileState = {
	fileId: string | null;
};

const initialState: LogFileState = {
	fileId: null,
};

const logFileSlice = createSlice({
	name: "logFile",
	initialState,
	reducers: {
		setFileId: (state, action: PayloadAction<string>) => {
			state.fileId = action.payload;
		},
		clearFileId: (state) => {
			state.fileId = null;
		},
	},
});

export const { setFileId, clearFileId } = logFileSlice.actions;
export default logFileSlice.reducer;
