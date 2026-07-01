import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FolderOpen, Clock, Settings } from "lucide-react";
import { uploadLog } from "../services/logservice";
import { useAppDispatch } from "../store/hooks";
import { addFileId } from "../store/logFileSlice";

export default function Sidebar() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadMessage, setUploadMessage] = useState("");
	const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
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
		setUploadMessage("");
		setUploadedFileId(null);

		try {
			const uploadedLog = await uploadLog(file);
			setUploadedFileId(uploadedLog.fileId);

			// stores  the current file and active file to redux
			dispatch(addFileId(uploadedLog.fileId));
			setUploadMessage(`${file.name} uploaded`);
		} catch (error) {
			console.error("Failed to upload log:", error);
			setUploadMessage("Upload failed");
		} finally {
			setIsUploading(false);
			event.target.value = "";
		}
	};

	return (
		<aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">
			<div className="border-b border-slate-800 p-6">
				<h1 className="text-2xl font-bold text-cyan-400">
					Log Explorer
				</h1>
				<p className="mt-1 text-sm text-slate-400">
					Modern Log Analyzer
				</p>
			</div>

			<nav className="flex flex-1 flex-col gap-3 p-4">
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

				{uploadMessage && (
					<p className="px-1 text-sm text-slate-400" aria-live="polite">
						{uploadMessage}
					</p>
				)}
				{uploadedFileId && (
					<p className="break-all px-1 text-xs text-slate-500">
						fileId: {uploadedFileId}
					</p>
				)}

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
		</aside>
	);
}
