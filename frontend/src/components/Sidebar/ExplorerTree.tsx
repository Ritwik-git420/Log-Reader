import type { FolderNode, ExplorerNode } from "../../types/explorer";

type ExplorerTreeProps = {
    rootFolder: FolderNode;
};

export default function ExplorerTree({ rootFolder }: ExplorerTreeProps) {

    const handleItemClick = (item: ExplorerNode) => {
        console.log("Clicked:", item.name);
    };

    return (
        <div className="px-3 py-2">
            <h2 className="mb-2 text-sm font-semibold text-cyan-300">
                {rootFolder.name}
            </h2>

            {rootFolder.children.map((item) => (
                <button
                    key={item.path}
                    onClick={() => handleItemClick(item)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-700"
                >
                    <span>
                        {item.type === "folder" ? "📁" : "📄"}
                    </span>

                    <span className="truncate">
                        {item.name}
                    </span>
                </button>
            ))}
        </div>
    );
}