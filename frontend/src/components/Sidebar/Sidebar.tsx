import { useRef, useState } from "react";
import type { ChangeEvent, PointerEvent } from "react";
import { FolderOpen, Clock, Settings } from "lucide-react";
import { uploadLog } from "../../services/logservice";
import { openFolder } from "../../services/folderService";
import { useAppDispatch } from "../../store/hooks";
import { addLogFile } from "../../store/logFileSlice";
import FolderPathInput from "./FolderPathInput";

type SidebarProps = {
	width: number;
	onResizeStart: (event: PointerEvent<HTMLDivElement>) => void;
};

export default function Sidebar({ width, onResizeStart }: SidebarProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const dispatch = useAppDispatch();

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		setIsUploading(true);

		try {
			//upload log function which sends the file to backend imported from /service
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
					className="flex items-center gap-3 rounded-lg bg-cyan-600 px-4 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700"
					type="button"
					onClick={openFilePicker}
					disabled={isUploading}
				>
					<FolderOpen size={20} />
					{isUploading ? "Uploading..." : "Open Log"}
				</button>

				<div className="h-px bg-slate-800" />

				{/* passes that function into FolderPathInput.tsx as the onOpenFolder prop */}
				<FolderPathInput onOpenFolder={openFolder} />

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
