
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
  const [tabs, setTabs] = useState<ViewerTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const handleOpenFile = async (file: File) => {
    const content = await file.text();
    const nextTab: ViewerTab = {
      id: `${file.name}-${file.lastModified}`,
      filename: file.name,
      content,
      size: file.size,
    };

    setTabs((prev) => {
      const alreadyOpen = prev.some((tab) => tab.id === nextTab.id);
      return alreadyOpen ? prev : [...prev, nextTab];
    });
    setActiveTabId(nextTab.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar onFileOpened={handleOpenFile} />

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