
import TabBar from "../components/TabBar";

type ViewerTab = {
  id: string;
  filename: string;
  content: string;
  size: number;
};

type LogViewerProps = {
  tabs: ViewerTab[];
  activeTabId: string | null;
  onSelectTab: (id: string | null) => void;
};

function LogViewer({ tabs, activeTabId, onSelectTab }: LogViewerProps) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0] ?? null;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-100">Log Viewer</h2>
        <p className="text-sm text-slate-400">
          Open a file and it will appear here as a tab.
        </p>
      </div>

      {tabs.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-slate-400">
          No logs opened yet.
        </div>
      ) : (
        <>
          <TabBar
            tabs={tabs}
            activeTabId={activeTab?.id ?? null}
            onSelectTab={onSelectTab}
          />

          <div className="flex-1 overflow-auto bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-200">{activeTab?.filename}</h3>
                <p className="text-sm text-slate-500">
                  {activeTab ? `${activeTab.size} bytes` : ""}
                </p>
              </div>
            </div>

            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-300">
              {activeTab?.content ?? ""}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default LogViewer;
