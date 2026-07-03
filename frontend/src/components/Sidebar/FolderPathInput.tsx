import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, CheckCircle2, FolderOpen, Loader2 } from "lucide-react";

type FolderPathInputProps = {
    onOpenFolder: (path: string) => Promise<unknown>;
};

export default function FolderPathInput({
    onOpenFolder,
}: FolderPathInputProps) {
    const [folderPath, setFolderPath] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [feedback, setFeedback] = useState("");

    const trimmedFolderPath = folderPath.trim();
    const isLoading = status === "loading";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!trimmedFolderPath) return;

        setStatus("loading");
        setFeedback("");

        try {
            const response = await onOpenFolder(trimmedFolderPath);
            const data = response as { message?: string; tree?: unknown } | undefined;
            const isValid = Boolean(data?.tree || data?.message?.toLowerCase().includes("scanned") || data?.message?.toLowerCase().includes("received"));

            if (isValid) {
                setStatus("success");
                setFeedback("Folder path valid and updated successfully.");
            } else {
                setStatus("error");
                setFeedback("Folder path could not be opened.");
            }
        } catch {
            setStatus("error");
            setFeedback("Folder path could not be opened.");
        }
    };

    if (status === "success") {
        return (
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/50 p-3 text-sm text-emerald-300">
                <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} />
                    <span>Folder opened</span>
                </div>
                <p className="mt-2 truncate text-emerald-400/80" title={trimmedFolderPath}>
                    {trimmedFolderPath}
                </p>
                <button
                    className="mt-3 text-sm font-medium text-emerald-200 transition hover:text-white"
                    type="button"
                    onClick={() => {
                        setStatus("idle");
                        setFeedback("");
                    }}
                >
                    Change folder
                </button>
            </div>
        );
    }

    return (
        <form className="rounded-lg border border-slate-800 bg-slate-900/50 p-3" onSubmit={handleSubmit}>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200" htmlFor="folder-path">
                <FolderOpen size={16} className="text-cyan-400" />
                Open folder
            </label>

            <div className="flex gap-2">
                <input
                    id="folder-path"
                    type="text"
                    value={folderPath}
                    placeholder="C:\\Logs"
                    onChange={(e) => setFolderPath(e.target.value)}
                    disabled={isLoading}
                    className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                    disabled={isLoading || !trimmedFolderPath}
                    className="inline-flex h-10 w-12 items-center justify-center rounded-md bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                    type="submit"
                    aria-label="Open folder"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FolderOpen size={18} />}
                </button>
            </div>

            {feedback ? (
                <p className={`mt-2 flex items-start gap-2 text-sm ${status === "error" ? "text-rose-400" : "text-slate-400"}`}>
                    {status === "error" ? <AlertCircle className="mt-0.5 shrink-0" size={15} /> : null}
                    <span>{feedback}</span>
                </p>
            ) : null}
        </form>
    );
}
