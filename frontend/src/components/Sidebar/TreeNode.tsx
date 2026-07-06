import { useState } from "react";
import type { ExplorerNode } from "../../types/explorer";
import { openFolder } from "../../services/folderService";
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Loader2 } from "lucide-react";
import { useAppDispatch } from "../../store/hooks";
import { addLogFile } from "../../store/logFileSlice";

type TreeNodeProps = {
    node: ExplorerNode;
    depth: number;
};

export default function TreeNode({ node, depth }: TreeNodeProps) {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<ExplorerNode[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch()
    const isFolder = node.type === "folder";

    const handleClick = async () => {
        if (!isFolder) {
            return;
        }

        if (!expanded && children === null) {
            setLoading(true);
            setError(null);

            try {
                const result = await openFolder(node.path);

                if ("children" in result) {
                    setChildren(result.children);
                } else {
                    setError(result.message);
                }
            } catch {
                setError("Failed to load folder");
            } finally {
                setLoading(false);
            }
        }

        setExpanded((prev) => !prev);
    };

        const handleDoubleClick = () => {
        if (isFolder) {
            return; // double-clicking a folder does nothing, only files open
        }
    
        dispatch(
            addLogFile({ fileId: node.path, filename: node.name, source: "folder" }),
        );
    };

    return (
        <div>
            <button
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                style={{ paddingLeft: `${depth * 16 + 12}px` }}
                className="group flex w-full items-center gap-2 rounded-md py-1.5 pr-3 text-left text-sm text-slate-300 transition  hover:bg-slate-800 hover:text-white active:translate-x-0"
                type="button"
            >
                <span className="flex w-3 shrink-0 items-center justify-center text-slate-500 transition group-hover:text-cyan-300">
                    {isFolder ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
                </span>
                <span className="flex shrink-0 items-center text-slate-400 transition group-hover:text-cyan-300">
                    {isFolder ? (
                        expanded ? <FolderOpen size={15} /> : <Folder size={15} />
                    ) : (
                        <FileText size={15} />
                    )}
                </span>
                <span className="truncate">{node.name}</span>
                {loading && <Loader2 size={13} className="ml-auto shrink-0 animate-spin text-cyan-400" />}
            </button>

            {error && <p className="py-1 pl-10 text-xs text-red-400">{error}</p>}

            {expanded && children && (
                <div>
                    {children.length === 0 ? (
                        <p className="py-1 pl-10 text-xs text-slate-500">Empty folder</p>
                    ) : (
                        children.map((child) => (
                            <TreeNode key={child.path} node={child} depth={depth + 1} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
