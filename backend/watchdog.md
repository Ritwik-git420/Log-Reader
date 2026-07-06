Architecture decision: Server-Sent Events (SSE), not WebSockets. You only need one-directional push (backend → frontend, "here's new content"), you never need to send messages back over the same connection. SSE runs over plain HTTP, the browser's EventSource API auto-reconnects if the connection drops, and it's noticeably less boilerplate than WebSockets for a push-only use case. WebSockets would be the right call if you needed bidirectional messaging — you don't here.

## Code explanation 
The most important line
self.loop.call_soon_threadsafe(
    self.async_queue.put_nowait, None)

Watchdog runs here - Thread A , FastAPI runs here - Thread B
Thread A cannot directly modify Thread B.
So instead it says