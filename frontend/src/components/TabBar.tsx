import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeLogFile, setActiveFileId } from "../store/logFileSlice";

export default function TabBar() {
  const dispatch = useAppDispatch();
  //list of all the files froom redux
  const files = useAppSelector((state) => state.logFile.files);
  //file id of current active file
  const activeFileId = useAppSelector((state) => state.logFile.activeFileId);

  return (
    <div className="flex gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
      {files.map((file) => {
        //search the files array and find the active file and store it a variable
        const isActive = file.fileId === activeFileId;

        return (
          <div
            key={file.fileId}
            className={`flex max-w-56 items-center rounded-t-lg border text-sm transition ${
              isActive
                ? "border-cyan-500 bg-cyan-600/10 text-cyan-300"
                : "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <button
              className="min-w-0 flex-1 truncate px-3 py-2 text-left"
              onClick={() => dispatch(setActiveFileId(file.fileId))}
              type="button"
            >
              {file.filename}
            </button>
            <button
              aria-label={`Close ${file.filename}`}
              className="mr-2 rounded p-0.5 text-slate-500 transition hover:bg-slate-700 hover:text-slate-100"
              onClick={(event) => {
                event.stopPropagation();
                dispatch(closeLogFile(file.fileId));
              }}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
