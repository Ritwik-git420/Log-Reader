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
    // caches loaded content per fileId so switching back to an already-viewed
    // tab doesn't hit the backend again. useRef, not useState - updating this
    // shouldn't itself trigger a re-render, it's just a lookup table.
    const contentCacheRef = useRef<Record<string, string>>({});
    // remembers the topmost visible line per tab, so switching back restores
    // where you left off instead of always landing on line 1
    const scrollPositionsRef = useRef<Record<string, number>>({});
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

        const fileId = activeFileId;
        const activeFile = files.find((f) => f.fileId === fileId);
        if (!activeFile) return;

        async function loadContent() {
            const cached = contentCacheRef.current[fileId];

            if (cached !== undefined) {
                // already loaded this tab before - use it, skip the network call entirely
                setContent(cached);
            } else {
                setContent("Loading file content...");

                try {
                    //loading content from backend - different source, different endpoint
                    const data =
                        activeFile!.source === "folder"
                            ? await openFileByPath(activeFile!.fileId)
                            : await getLogContent(activeFile!.fileId);

                    if ("content" in data) {
                        contentCacheRef.current[fileId] = data.content;
                        setContent(data.content);
                    } else {
                        setContent(data.message);
                        return; // don't touch scroll position for an error message
                    }
                } catch (error) {
                    console.error("Failed to load log content:", error);
                    setContent("Failed to load file content.");
                    return;
                }
            }

            // restore this tab's saved position, or default to the top (line 1)
            // if it's never been scrolled before
            requestAnimationFrame(() => {
                displayFileRef.current?.scrollToIndex(
                    scrollPositionsRef.current[fileId] ?? 0,
                );
            });
        }

        loadContent();
    }, [activeFileId, files]);

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
            setContent((prev) => {
                const updated = prev + newContent;
                // keep the cache in sync - otherwise switching away and back
                // to a tab being live-tailed would show stale, pre-update content
                contentCacheRef.current[activeFileId] = updated;
                return updated;
            });

            requestAnimationFrame(() => {
                displayFileRef.current?.scrollToBottom();
            });
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
                        onScrollPositionChange={(topLineIndex) => {
                            if (activeFileId) {
                                scrollPositionsRef.current[activeFileId] = topLineIndex;
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default LogViewer;
