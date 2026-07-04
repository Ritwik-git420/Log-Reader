import { useRef, useState, useEffect } from "react";
import type { ChangeEvent, PointerEvent } from "react";
import { FolderOpen, Clock, Settings } from "lucide-react";
import { uploadLog } from "../../services/logservice";
import { openFolder } from "../../services/folderService";
import { useAppDispatch } from "../../store/hooks";
import { addLogFile } from "../../store/logFileSlice";
import type { FolderNode } from "../../types/explorer";
import FolderPathInput from "./FolderPathInput";
import ExplorerTree from "./ExplorerTree";

type SidebarProps = {
	width: number;
	onResizeStart: (event: PointerEvent<HTMLDivElement>) => void;
};

export default function Sidebar({ width, onResizeStart }: SidebarProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [rootFolder, setRootFolder] = useState<FolderNode | null>(null);
	const dispatch = useAppDispatch();
	const LAST_FOLDER_PATH_KEY = "logreader:lastFolderPath";

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const handleOpenFolder = async (path: string) => {
		try {
			const folder = await openFolder(path);

			if ("type" in folder && folder.type === "folder") {
				setRootFolder(folder);
				localStorage.setItem(LAST_FOLDER_PATH_KEY, path);
				return true;
			}
		} catch (error) {
			console.error("Failed to open folder:", error);
			localStorage.removeItem(LAST_FOLDER_PATH_KEY);
		}

		return false;
	};

	useEffect(() => {
		const savedPath = localStorage.getItem(LAST_FOLDER_PATH_KEY);
		if (savedPath) {
			handleOpenFolder(savedPath);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		setIsUploading(true);

		try {
			//upload log function which sends the file to backend 
			const uploadedLog = await uploadLog(file);

			// stores the current file and active file to redux
			dispatch(
				addLogFile({
					fileId: uploadedLog.fileId,
					filename: uploadedLog.filename,
				}),
			);
		} catch (error) {
			console.error("Failed to upload log:", error);
		} finally {
			setIsUploading(false);
			event.target.value = "";
		}
	};

	return (
		<aside
			className="relative flex h-screen shrink-0 flex-col border-r border-slate-800 bg-slate-950"
			style={{ width }}
		>
			<div className="border-b border-slate-800 p-6">
				<h1 className="text-2xl font-bold text-cyan-400">
					Log Explorer
				</h1>
				<p className="mt-1 text-sm text-slate-400">
					Modern Log Analyzer
				</p>
			</div>

			<nav className="flex flex-1 flex-col gap-4 p-4">
				<input
					ref={fileInputRef}
					type="file"
					accept=".log,.txt"
					className="hidden"
					onChange={handleFileChange}
				/>

				<button
					className="flex w-full items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-left text-sm font-medium text-slate-200 shadow-sm shadow-black/20 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
					type="button"
					onClick={openFilePicker}
					disabled={isUploading}
				>
					<FolderOpen size={16} className="text-cyan-400" />
					{isUploading ? "Uploading..." : "Open Log"}
				</button>

				<div className="h-px bg-slate-800" />

				<FolderPathInput hasFolder={Boolean(rootFolder)} onOpenFolder={handleOpenFolder} />

				{rootFolder && (
					<ExplorerTree rootFolder={rootFolder} />
				)}

				<div className="h-px bg-slate-800" />

				<button className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800">
					<Clock size={20} />
					Recent Files
				</button>
			</nav>

			<div className="border-t border-slate-800 p-4">
				<button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800">
					<Settings size={20} />
					Settings
				</button>
			</div>

			<div
				className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent transition hover:bg-cyan-500/70"
				role="separator"
				aria-label="Resize sidebar"
				aria-orientation="vertical"
				onPointerDown={onResizeStart}
			/>
		</aside>
	);
}
