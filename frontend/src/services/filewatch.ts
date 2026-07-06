import { API_BASE_URL } from "./api";

// Opens a live SSE connection that streams newly-appended content for a file.
// Returns a cleanup function - call it to close the connection (e.g. on unmount
// or when switching to a different tab).
export function watchFileChanges(
	path: string,
	onNewContent: (content: string) => void,
): () => void {
	const url = `${API_BASE_URL}/log/file/watch?path=${encodeURIComponent(path)}`;
	const eventSource = new EventSource(url);

	eventSource.onmessage = (event) => {
		onNewContent(event.data);
	};

	eventSource.onerror = () => {
		console.error("Live file watch connection lost");
		// EventSource auto-reconnects on its own by default - nothing else needed here
	};

	return () => {
		eventSource.close();
	};
}