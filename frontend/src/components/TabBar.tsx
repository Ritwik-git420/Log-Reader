type ViewerTab = {
  id: string;
  filename: string;
  content: string;
  size: number;
};

type TabBarProps = {
  tabs: ViewerTab[];
  activeTabId: string | null;
  onSelectTab: (id: string | null) => void;
};

export default function TabBar({ tabs, activeTabId, onSelectTab }: TabBarProps) {
  return (
    <div className="flex gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`rounded-t-lg border px-3 py-2 text-sm transition ${
              isActive
                ? "border-cyan-500 bg-cyan-600/10 text-cyan-300"
                : "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.filename}
          </button>
        );
      })}
    </div>
  );
}
