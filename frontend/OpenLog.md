## How open log works (uploading single log file)

Sidebar.tsx — clicking "Open Log" triggers a hidden <input type="file">. Picking a file fires handleFileChange.

handleFileChange calls uploadLog(file) from logservice.ts, which builds a FormData and does POST /log/upload (multipart).

Backend (log_routes.py → upload_log) receives the bytes and calls save_uploaded_file() in savefile.py. That function generates a UUID, physically copies the file's bytes into the uploads/ folder as {uuid}.log, and returns { fileId, filename, path }.

Back in Sidebar.tsx, that response gets dispatched: addLogFile({ fileId, filename, source: "upload" }) — this pushes into Redux's files array and sets it as activeFileId.

LogViewer.tsx watches activeFileId. Since source === "upload", it calls getLogContent(fileId) from logservice.ts → GET /log/{fileId}/content.

Backend's get_log_content calls read_saved_file(file_id), which scans the uploads/ folder for a filename starting with that UUID, reads it, and returns { fileId, content }.

LogViewer sets that into content state and renders it line-by-line in the <pre> block.


## How opening file after specifying folder path works