import { useEffect, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Loader2 } from "lucide-react";

type FolderPathInputProps = {
    hasFolder: boolean;
    onOpenFolder: (path: string) => Promise<boolean>;
};

export default function FolderPathInput({
    hasFolder,
    onOpenFolder,
}: FolderPathInputProps) {
    const [folderPath, setFolderPath] = useState("");
    const [isExpanded, setIsExpanded] = useState(!hasFolder);
    const [isLoading, setIsLoading] = useState(false);
    const trimmedFolderPath = folderPath.trim();

    useEffect(() => {
        if (hasFolder) {
            setIsExpanded(false);
        }
    }, [hasFolder]);

    const submitFolderPath = async () => {
        if (!trimmedFolderPath) return;

        setIsLoading(true);

        try {
            const opened = await onOpenFolder(trimmedFolderPath);

            if (opened) {
                setIsExpanded(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await submitFolderPath();
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        await submitFolderPath();
    };

    return (
        <form
            className="rounded-lg border border-slate-800 bg-slate-900/60 shadow-sm shadow-black/20 transition hover:border-slate-700 hover:bg-slate-900"
            onSubmit={handleSubmit}
        >
            <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                type="button"
                onClick={() => setIsExpanded((current) => !current)}
                aria-expanded={isExpanded}
            >
                {isExpanded ? (
                    <ChevronDown size={16} className="text-cyan-400" />
                ) : (
                    <ChevronRight size={16} className="text-cyan-400" />
                )}
                <FolderOpen size={16} className="text-cyan-400" />
                <span>{hasFolder ? "Open new path" : "Open folder"}</span>
            </button>

            {isExpanded && (
                <div className="mx-3 mb-3 mt-1 flex gap-2 rounded-md border border-slate-800 bg-slate-950/80 p-1 transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20">
                    <input
                        id="folder-path"
                        type="text"
                        value={folderPath}
                        placeholder="C:\\Logs"
                        onChange={(e) => setFolderPath(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                        className="inline-flex h-10 w-11 items-center justify-center rounded-md bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                        type="submit"
                        disabled={!trimmedFolderPath || isLoading}
                        aria-label="Open folder"
                    >
                        {isLoading ? <Loader2 size={17} className="animate-spin" /> : <FolderOpen size={17} />}
                    </button>
                </div>
            )}
        </form>
    );
}
