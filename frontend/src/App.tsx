import { useCallback, useEffect, useState } from "react";
import type { PointerEvent } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import LogViewer from "./pages/LogViewer";

const MIN_SIDEBAR_WIDTH = 224;
const MAX_SIDEBAR_WIDTH = 420;
const DEFAULT_SIDEBAR_WIDTH = 256;
const SIDEBAR_WIDTH_STORAGE_KEY = "log-reader-sidebar-width";

function clampSidebarWidth(width: number) {
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}

function getSavedSidebarWidth() {
  const savedWidth = Number(localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY));

  if (!Number.isFinite(savedWidth)) {
    return DEFAULT_SIDEBAR_WIDTH;
  }

  return clampSidebarWidth(savedWidth);
}

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(getSavedSidebarWidth);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  const handleSidebarResizeStart = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();

      const startX = event.clientX;
      const startWidth = sidebarWidth;
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
        const nextWidth = startWidth + moveEvent.clientX - startX;
        setSidebarWidth(clampSidebarWidth(nextWidth));
      };

      const stopResizing = () => {
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointercancel", stopResizing);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopResizing, { once: true });
      window.addEventListener("pointercancel", stopResizing, { once: true });
    },
    [sidebarWidth],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar
          width={sidebarWidth}
          onResizeStart={handleSidebarResizeStart}
        />

        <main className="min-w-0 flex-1 p-6">
          <LogViewer />
        </main>
      </div>
    </div>
  );
}

export default App;
