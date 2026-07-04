import type { FolderNode } from "../../types/explorer";
import TreeNode from "./TreeNode";

type ExplorerTreeProps = {
    rootFolder: FolderNode;
};

export default function ExplorerTree({ rootFolder }: ExplorerTreeProps) {
    return (
        <div className="px-3 py-2">
            <h2 className="mb-2 text-sm font-semibold text-cyan-300">
                {rootFolder.name}
            </h2>

            {rootFolder.children.map((item) => (
                <TreeNode key={item.path} node={item} depth={0} />
            ))}
        </div>
    );
}