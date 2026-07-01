
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import LogViewer from "./pages/LogViewer";

type ViewerTab = {
  id: string;
  filename: string;
  content: string;
  size: number;
};

function App() {
  const [tabs] = useState<ViewerTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <LogViewer
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
