import { forwardRef, memo, useImperativeHandle, useRef, type ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// the imperative API LogViewer uses to control scrolling from outside -
// this is the "handle" that replaces direct access to rowVirtualizer
export type DisplayFileHandle = {
    scrollToIndex: (
        index: number,
        options?: { align?: "start" | "center" | "end" | "auto" },
    ) => void;
    scrollToBottom: () => void;
};

type DisplayFileProps = {
    lines: string[];
    currentMatchLineIndex: number;
    normalizedSearchTerm: string;
    onScrollPositionChange?: (topLineIndex: number) => void;
};

// splits a line into plain-text segments and highlighted-match segments,
// so only the actual matched substring gets styled, not the whole line
function highlightLine(line: string, term: string): ReactNode {
    if (!term) return line;

    const lowerLine = line.toLowerCase();
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = lowerLine.indexOf(term, lastIndex);

    if (matchIndex === -1) return line;

    let key = 0;
    while (matchIndex !== -1) {
        if (matchIndex > lastIndex) {
            parts.push(line.slice(lastIndex, matchIndex));
        }

        parts.push(
            <mark
                key={key++}
                className="rounded-sm bg-amber-400/80 text-slate-950"
            >
                {line.slice(matchIndex, matchIndex + term.length)}
            </mark>,
        );

        lastIndex = matchIndex + term.length;
        matchIndex = lowerLine.indexOf(term, lastIndex);
    }

    if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
    }

    return parts;
}

const DisplayFile = forwardRef<DisplayFileHandle, DisplayFileProps>(
    function DisplayFile(
        { lines, currentMatchLineIndex, normalizedSearchTerm, onScrollPositionChange },
        ref,
    ) {
        // scroll ref + virtualizer now live HERE, not in LogViewer -
        // scrolling is this component's own concern, it owns its own re-renders
        const logScrollRef = useRef<HTMLDivElement>(null);

        const rowVirtualizer = useVirtualizer({
            count: lines.length,
            getScrollElement: () => logScrollRef.current,
            estimateSize: () => 28,
            overscan: 10,
        });

        // exposes a small, deliberate API to the parent instead of the whole
        // virtualizer object - LogViewer can ask "scroll to X", it can't reach in
        // and touch virtualizer internals directly anymore
        useImperativeHandle(ref, () => ({
            scrollToIndex: (index, options) => {
                rowVirtualizer.scrollToIndex(index, options);
            },
            scrollToBottom: () => {
                rowVirtualizer.scrollToIndex(lines.length - 1, { align: "end" });
            },
        }));

        // reports the topmost currently-visible line index as the user scrolls,
        // so LogViewer can remember "where you were" per tab
        const handleScroll = () => {
            const topItem = rowVirtualizer.getVirtualItems()[0];
            if (topItem) {
                onScrollPositionChange?.(topItem.index);
            }
        };

        return (
            <div
                ref={logScrollRef}
                onScroll={handleScroll}
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
                        const isCurrentMatch = virtualRow.index === currentMatchLineIndex;
                        const isSearchMatch =
                            normalizedSearchTerm &&
                            line.toLowerCase().includes(normalizedSearchTerm);

                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={rowVirtualizer.measureElement}
                                className={`absolute left-0 top-0 grid w-full grid-cols-[4rem_1fr] ${
                                    isCurrentMatch
                                        ? "bg-cyan-500/15"
                                        : isSearchMatch
                                          ? "bg-amber-500/10"
                                          : ""
                                }`}
                                style={{ transform: `translateY(${virtualRow.start}px)` }}
                            >
                                <span
                                    className={`select-none pr-4 text-right ${
                                        isCurrentMatch ? "text-cyan-300" : "text-slate-600"
                                    }`}
                                >
                                    {virtualRow.index + 1}
                                </span>
                                <span className="whitespace-pre-wrap break-words text-slate-300">
                                    {normalizedSearchTerm && isCurrentMatch
                                        ? highlightLine(line, normalizedSearchTerm)
                                        : line}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);

export default memo(DisplayFile);