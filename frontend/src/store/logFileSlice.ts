import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type LogFile = {
	fileId: string;
	filename: string;
	source: "upload" | "folder";
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
		
		//file close function 
		closeLogFile: (state, action: PayloadAction<string>) => {
			const closedFileIndex = state.files.findIndex(
				(file) => file.fileId === action.payload,
			);

			if (closedFileIndex === -1) {
				return;
			}
			//remove the file from redux
			state.files.splice(closedFileIndex, 1);

			//if the closed tab was inactive we are done
			if (state.activeFileId !== action.payload) {
				return;
			}

			//code for picking next active file
			let nextActiveFile: LogFile | null = null;

			if (state.files.length === 0) {
				nextActiveFile = null;
			}

			// Is there still a tab at the same index?
			// (This will be the tab to the right of the closed one.)
			else if (state.files[closedFileIndex]) {
				nextActiveFile = state.files[closedFileIndex];
			}

			// Otherwise the closed tab was the last one,
			// so activate the previous tab.
			else {
				nextActiveFile = state.files[closedFileIndex - 1];
			}

			state.activeFileId = nextActiveFile?.fileId ?? null;
		},
		clearLogFiles: (state) => {
			state.files = [];
			state.activeFileId = null;
		},
	},
});

export const { addLogFile, setActiveFileId, closeLogFile, clearLogFiles } =
	logFileSlice.actions;
export default logFileSlice.reducer;
