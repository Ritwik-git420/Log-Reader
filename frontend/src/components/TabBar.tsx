import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveFileId } from "../store/logFileSlice";

export default function TabBar() {
  const dispatch = useAppDispatch();
  //check the current active file from redux 
  const files = useAppSelector((state) => state.logFile.files);
  const activeFileId = useAppSelector((state) => state.logFile.activeFileId);

  return (
    <div className="flex gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
      {files.map((file) => {
        const isActive = file.fileId === activeFileId;

        return (
          <button
            key={file.fileId}
            type="button"
            onClick={() => dispatch(setActiveFileId(file.fileId))}
            className={`rounded-t-lg border px-3 py-2 text-sm transition ${
              isActive
                ? "border-cyan-500 bg-cyan-600/10 text-cyan-300"
                : "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {file.filename}
          </button>
        );
      })}
    </div>
  );
}
