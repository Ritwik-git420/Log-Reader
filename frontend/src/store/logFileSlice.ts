import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type LogFile = {
	fileId: string;
	filename: string;
};

//array to store multiple file ids, to handle multiple files
export type LogFileState = {
	files: LogFile[];
	activeFileId: string | null;
};

const initialState: LogFileState = {
	files: [],
	activeFileId: null,
};

const logFileSlice = createSlice({
	name: "logFile",
	initialState,
	reducers: {
		addLogFile: (state, action: PayloadAction<LogFile>) => {
			const alreadyOpen = state.files.some(
				(file) => file.fileId === action.payload.fileId,
			);

			if (!alreadyOpen) {
				state.files.push(action.payload);
			}

			state.activeFileId = action.payload.fileId;
		},
		setActiveFileId: (state, action: PayloadAction<string>) => {
			state.activeFileId = action.payload;
		},
		clearLogFiles: (state) => {
			state.files = [];
			state.activeFileId = null;
		},
	},
});

export const { addLogFile, setActiveFileId, clearLogFiles } =
	logFileSlice.actions;
export default logFileSlice.reducer;
