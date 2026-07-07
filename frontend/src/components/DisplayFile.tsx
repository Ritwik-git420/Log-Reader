import type { RefObject } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";

type DisplayFileProps = {
    logScrollRef: RefObject<HTMLDivElement | null>;
    lines: string[];
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
    currentMatchLineIndex: number;
    normalizedSearchTerm: string;
};

function DisplayFile({
    logScrollRef,
    lines,
    rowVirtualizer,
    currentMatchLineIndex,
    normalizedSearchTerm,
}: DisplayFileProps) {
    return (
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
                                {line}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DisplayFile;
