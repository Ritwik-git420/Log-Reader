But I’d put that useEffect in LogViewer, not App, because fetching/displaying log content is viewer responsibility.
Flow:
Sidebar uploads file
  -> dispatch(addFileId(fileId))
  -> Redux activeFileId changes

LogViewer watches activeFileId
  -> useEffect runs
  -> fetch backend content by fileId
  -> display content
Example in LogViewer.tsx later:
const activeFileId = useAppSelector((state) => state.logFile.activeFileId);

useEffect(() => {
	if (!activeFileId) {
		return;
	}

	async function loadLogContent() {
		const response = await getLogContent(activeFileId);
		setContent(response.content);
	}

	loadLogContent();
}, [activeFileId]);
Then service:
export async function getLogContent(fileId: string) {
	const response = await api.get(`/log/${fileId}/content`);
	return response.data;
}
And backend endpoint:
@router.get("/{file_id}/content")
def get_log_content(file_id: str):
    ...
So yes, the idea is right: use useEffect to track Redux. I’d just attach it to the component that needs the data, usually LogViewer, instead of making App fetch and pass props around again. Since Redux exists now, App can stay dumb and just render layout.