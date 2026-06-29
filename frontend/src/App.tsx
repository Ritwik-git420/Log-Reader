
import Sidebar from "./components/Sidebar";
import LogViewer from "./pages/logviewer";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <LogViewer />
        </main>
      </div>
    </div>
  );
}

export default App;