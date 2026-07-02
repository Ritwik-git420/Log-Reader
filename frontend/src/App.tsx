import Sidebar from "./components/Sidebar";
import LogViewer from "./pages/LogViewer";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <LogViewer />
        </main>
      </div>
    </div>
  );
}

export default App;
