import os
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# creates a class that Watchdog call when anything changes
class FileChangeHandler(FileSystemEventHandler):

    def __init__(self, target_path: str, loop: asyncio.AbstractEventLoop, async_queue: asyncio.Queue):
        self.target_path = os.path.abspath(target_path)
        self.loop = loop
        self.async_queue = async_queue

    #recieves a watchdog event checks if file changed yet 
    def on_modified(self, event):
        if event.is_directory:
            return
        
        # watchdog watches a whole directory - filter down to just our file
        if os.path.abspath(event.src_path) == self.target_path:
            # we're on watchdog's thread here, so we can't touch the asyncio
            # queue directly - call_soon_threadsafe hands it to the event loop safely
            self.loop.call_soon_threadsafe(self.async_queue.put_nowait, None)
        
def format_sse(data: str) -> str:
    # SSE requires every line of a multi-line message to be prefixed with "data: ",
    # and the event must end with a blank line
    lines = data.split("\n")
    return "".join(f"data: {line}\n" for line in lines) + "\n"

async def tail_file(path: str, request):
    """
    Async generator that yields newly appended content in `path` as it happens.
    Stops and cleans up the watchdog observer when the client disconnects.
    """
    if not os.path.isfile(path):
        yield format_sse("[watch error: file not found]")
        return
 
    directory = os.path.dirname(path)
    loop = asyncio.get_event_loop()
    async_queue: asyncio.Queue = asyncio.Queue()
 
    handler = FileChangeHandler(path, loop, async_queue)
    observer = Observer()
    observer.schedule(handler, directory, recursive=False)
    observer.start()
 
    # start from the CURRENT end of file - the initial content was already
    # loaded by the regular /file/content fetch, we only want what's new from here
    last_position = os.path.getsize(path)
 
    try:
        while True:
            if await request.is_disconnected():
                break
 
            try:
                await asyncio.wait_for(async_queue.get(), timeout=1)
            except asyncio.TimeoutError:
                continue  # just a periodic check for disconnect, not a real event
 
            if not os.path.isfile(path):
                continue
 
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                f.seek(last_position)
                new_content = f.read()
                last_position = f.tell()
 
            if new_content:
                yield format_sse(new_content)
    finally:
        observer.stop()
        observer.join()
    
