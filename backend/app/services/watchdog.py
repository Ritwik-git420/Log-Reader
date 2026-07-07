import os
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


# creates a class that Watchdog calls when anything changes
class FileChangeHandler(FileSystemEventHandler):

    def __init__(self, target_path: str, loop: asyncio.AbstractEventLoop, async_queue: asyncio.Queue):
        self.target_path = os.path.abspath(target_path)
        self.loop = loop
        self.async_queue = async_queue

    # receives a watchdog event whenever a file is modified
    def on_modified(self, event):
        print("EVENT:", event.src_path)

        if event.is_directory:
            return

        print("TARGET :", self.target_path)
        print("CURRENT:", os.path.abspath(event.src_path))

        # watchdog watches a whole directory - filter down to just our file
        if os.path.abspath(event.src_path) == self.target_path:
            print("MATCHED!")
            self.loop.call_soon_threadsafe(self.async_queue.put_nowait, None)


    #For linux files because they dont directly modify the exact file in text editor
    def on_moved(self, event):
        if event.is_directory:
            return

        if os.path.abspath(event.dest_path) == self.target_path:
            print("MATCHED (MOVE)")
            self.loop.call_soon_threadsafe(self.async_queue.put_nowait, None)       


def format_sse(data: str) -> str:
    # SSE requires every line of a multi-line message to be prefixed with "data: "
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

    print("Watching file:", path)

    directory = os.path.dirname(path)
    print("Watching directory:", directory)

    loop = asyncio.get_event_loop()
    async_queue: asyncio.Queue = asyncio.Queue()

    handler = FileChangeHandler(path, loop, async_queue)

    observer = Observer()
    observer.schedule(handler, directory, recursive=False)
    observer.start()

    print("Observer started")

    # start from current end of file
    last_position = os.path.getsize(path)

    try:
        while True:

            if await request.is_disconnected():
                break

            try:
                await asyncio.wait_for(async_queue.get(), timeout=1)
            except asyncio.TimeoutError:
                continue

            if not os.path.isfile(path):
                continue

            print("Reading new content")

            with open(path, "r", encoding="utf-8", errors="replace") as f:
                f.seek(last_position)

                new_content = f.read()
                print("NEW CONTENT:", new_content)

                last_position = f.tell()

            if new_content:
                yield format_sse(new_content)

    finally:
        observer.stop()
        observer.join()
