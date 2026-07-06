You double-click a file → TreeNode dispatches addLogFile, activeFileId becomes that file's path.

First useEffect in LogViewer fires (as before) → fetches the full current content once via openFileByPath.

Second useEffect also fires (new) → since source === "folder", it calls watchFileChanges(path, callback), which opens new EventSource(...) pointed at your /api/log/file/watch route.
That HTTP connection reaches your backend's watch_file route, which starts StreamingResponse(tail_file(...)) — this doesn't close the connection like a normal request; it stays open and keeps writing to it.

Inside tail_file, Observer starts watching the file's parent directory on its own OS thread — remember, watchdog physically can't watch a single file, only a directory, so on_modified fires for any change in that folder, and the handler filters it down to just your file's exact path.

The moment something external appends to that file (your terminal's echo >>, or a real app writing logs), on_modified fires on watchdog's thread. Since it can't safely poke the asyncio queue from a foreign thread, call_soon_threadsafe schedules that hand-off safely onto the event loop.

The while True loop inside tail_file, which was blocked waiting on async_queue.get(), wakes up, seeks to last_position (where it left off), reads only the new bytes, and yields them formatted as an SSE data: message.

Because the HTTP connection is still open (SSE keeps it alive), that chunk gets pushed straight down the wire to the browser.

Your EventSource.onmessage in filewatchService.ts fires, calling onNewContent(event.data) — which in LogViewer is (newContent) => setContent((prev) => prev + newContent), appending rather than replacing.

React re-renders LogViewer with the extended content, and your existing scroll-to-bottom effect (the one watching [content, activeFileId]) kicks in and auto-scrolls to reveal the new line.