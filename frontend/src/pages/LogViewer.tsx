import { useEffect, useMemo, useRef, useState } from "react";
import TabBar from "../components/TabBar";
import { useAppSelector } from "../store/hooks";
import { getLogContent } from "../services/logservice";
import { openFileByPath } from "../services/folderService";
import { watchFileChanges } from "../services/filewatch";
import { useVirtualizer } from "@tanstack/react-virtual";

function LogViewer() {
    const files = useAppSelector((state) => state.logFile.files);
    const activeFileId = useAppSelector((state) => state.logFile.activeFileId);
    const [content, setContent] = useState("");
    const logScrollRef = useRef<HTMLDivElement>(null);
    const lines = useMemo(() => content.split("\n"), [content]);
    const rowVirtualizer = useVirtualizer({
        count: lines.length,    //total lines in the file
        getScrollElement: () => logScrollRef.current,     //points the virtualizer at scroll continer 
        estimateSize: () => 28,
        overscan: 10,
    });

    useEffect(() => {
        if (!activeFileId) {
            setContent("");
            return;
        }

        const activeFile = files.find((f) => f.fileId === activeFileId);
        if (!activeFile) return;

        async function loadContent() {
            setContent("Loading file content...");

            try {
                //loading content from backend - different source, different endpoint
                const data =
                    activeFile!.source === "folder"
                        ? await openFileByPath(activeFile!.fileId)
                        : await getLogContent(activeFile!.fileId);

                if ("content" in data) {
                    setContent(data.content);
                } else {
                    setContent(data.message);
                }
            } catch (error) {
                console.error("Failed to load log content:", error);
                setContent("Failed to load file content.");
            }
        }

        loadContent();
    }, [activeFileId, files]);

    useEffect(() => {
        const scrollContainer = logScrollRef.current;

        if (!scrollContainer) {
            return;
        }

        requestAnimationFrame(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
    }, [content, activeFileId]);

    // to track live updates in the active file using watchdog
    useEffect(() => {
        if (!activeFileId) return;
        //only folder opened files are tracked for now
        const activeFile = files.find((f) => f.fileId === activeFileId);
        if (!activeFile || activeFile.source !== "folder") return;

        const stopWatching = watchFileChanges(activeFile.fileId, (newContent) => {
            setContent((prev) => prev + newContent);
        });

        return () => stopWatching();
    }, [files, activeFileId]);


    return (
        <div className="flex h-[calc(100vh-3rem)] flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
            <div className="border-b border-slate-800 px-4 py-3">
                <h2 className="text-lg font-semibold text-slate-100">Log Viewer</h2>
                <p className="text-sm text-slate-400">
                    Open a file and it will appear here as a tab.
                </p>
            </div>

            {files.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-slate-400">
                    No logs opened yet.
                </div>
            ) : (
                <>
                    <TabBar />

                    <div
                        ref={logScrollRef}
                        className="scrollbar-hidden flex-1 overflow-auto bg-slate-950 p-4"
                    >
                        <div
                            className="relative font-mono text-sm leading-7 text-slate-300"
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const line = lines[virtualRow.index];

                                return (
                                    <div
                                        key={virtualRow.key}  data-index={virtualRow.index} ref={rowVirtualizer.measureElement}
                                        className="absolute left-0 top-0 grid w-full grid-cols-[4rem_1fr]"
                                        style={{transform: `translateY(${virtualRow.start}px)`, }}>
                                            
                                        <span className="select-none pr-4 text-right text-slate-600">
                                            {virtualRow.index + 1}
                                        </span>
                                        <span className="whitespace-pre-wrap break-words text-slate-300">
                                            {line}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default LogViewer;