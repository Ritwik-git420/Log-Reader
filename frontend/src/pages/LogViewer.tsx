import { useEffect, useMemo, useRef, useState } from "react";
import TabBar from "../components/TabBar";
import { useAppSelector } from "../store/hooks";
import { getLogContent } from "../services/logservice";
import { openFileByPath } from "../services/folderService";
import { watchFileChanges } from "../services/filewatch";
import Searchbar from "../components/Searchbar";
import DisplayFile, { type DisplayFileHandle } from "./DisplayFile";

function LogViewer() {
    const files = useAppSelector((state) => state.logFile.files);
    const activeFileId = useAppSelector((state) => state.logFile.activeFileId);
    const [content, setContent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const displayFileRef = useRef<DisplayFileHandle>(null);
    const lines = useMemo(() => content.split("\n"), [content]);

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const matchingLineIndexes = useMemo(() => {
        if (!normalizedSearchTerm) return [];   //if nothing typed in search we return simply

        //find the searched term in the lines
        return lines.reduce<number[]>((matches, line, index) => {
            if (line.toLowerCase().includes(normalizedSearchTerm)) {
                matches.push(index);
            }

            return matches;
        }, []);
    }, [lines, normalizedSearchTerm]);
    const currentMatchLineIndex = matchingLineIndexes[currentMatchIndex];


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
        // scrolling is DisplayFile's job now - just ask it to do it
        requestAnimationFrame(() => {
            displayFileRef.current?.scrollToBottom();
        });
    }, [content, activeFileId]);

    useEffect(() => {
        //auto jump when search changes
        if (matchingLineIndexes.length === 0) {
            setCurrentMatchIndex(-1);
            return;
        }

        setCurrentMatchIndex(0);
        displayFileRef.current?.scrollToIndex(matchingLineIndexes[0], {
            align: "center",  //aligns the match at the center
        });
    }, [matchingLineIndexes]);

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

    function goToMatch(matchIndex: number) {
        const lineIndex = matchingLineIndexes[matchIndex];

        if (lineIndex === undefined) {
            return;
        }

        setCurrentMatchIndex(matchIndex);
        displayFileRef.current?.scrollToIndex(lineIndex, {
            align: "center",
        });
    }

    function goToNextMatch() {
        if (matchingLineIndexes.length === 0) {
            return;
        }

        const nextMatchIndex =
            currentMatchIndex >= matchingLineIndexes.length - 1
                ? 0
                : currentMatchIndex + 1;

        goToMatch(nextMatchIndex);
    }

    function goToPreviousMatch() {
        if (matchingLineIndexes.length === 0) {
            return;
        }

        const previousMatchIndex =
            currentMatchIndex <= 0
                ? matchingLineIndexes.length - 1
                : currentMatchIndex - 1;

        goToMatch(previousMatchIndex);
    }


    return (
        <div className="flex h-[calc(100vh-3rem)] flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-100">Log Viewer</h2>
                    <p className="text-sm text-slate-400">
                        Open a file and it will appear here as a tab.
                    </p>
                </div>
                <Searchbar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    currentMatchNumber={currentMatchIndex + 1}
                    matchCount={matchingLineIndexes.length}
                    onNextMatch={goToNextMatch}
                    onPreviousMatch={goToPreviousMatch}
                />
            </div>

            {files.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-slate-400">
                    No logs opened yet.
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-3 py-2">
                        <TabBar />
                    </div>

                    <DisplayFile
                        ref={displayFileRef}
                        lines={lines}
                        currentMatchLineIndex={currentMatchLineIndex}
                        normalizedSearchTerm={normalizedSearchTerm}
                    />
                </>
            )}
        </div>
    );
}

export default LogViewer;