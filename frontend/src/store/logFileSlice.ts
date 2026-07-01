import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

//array to store multiple file ids, to handle multiple files
type LogFileState = {
	fileIds: string[];
	activeFileId: string | null;
};

const initialState: LogFileState = {
	fileIds: [],
	activeFileId: null,
};

const logFileSlice = createSlice({
	name: "logFile",
	initialState,
	reducers: {
		addFileId: (state, action: PayloadAction<string>) => {
			if (!state.fileIds.includes(action.payload)) {
				state.fileIds.push(action.payload);
			}

			state.activeFileId = action.payload;
		},
		setActiveFileId: (state, action: PayloadAction<string>) => {
			state.activeFileId = action.payload;
		},
		clearFileIds: (state) => {
			state.fileIds = [];
			state.activeFileId = null;
		},
	},
});

export const { addFileId, setActiveFileId, clearFileIds } = logFileSlice.actions;
export default logFileSlice.reducer;