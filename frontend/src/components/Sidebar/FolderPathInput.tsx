import { useState } from "react";
import type { FormEvent } from "react";
import { FolderOpen } from "lucide-react";

type FolderPathInputProps = {
    onOpenFolder: (path: string) => void;
};

export default function FolderPathInput({
    onOpenFolder,
}: FolderPathInputProps) {
    const [folderPath, setFolderPath] = useState("");
    const trimmedFolderPath = folderPath.trim();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!trimmedFolderPath) return;

        onOpenFolder(trimmedFolderPath);
    };

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
                    className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button
                    disabled={!trimmedFolderPath}
                    className="inline-flex h-10 w-12 items-center justify-center rounded-md bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                    type="submit"
                    aria-label="Open folder"
                >
                    <FolderOpen size={18} />
                </button>
            </div>
        </form>
    );
}
