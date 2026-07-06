from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.savefile import save_uploaded_file, read_saved_file
from app.services.foldertree import scan_folder
from app.services.filreader import read_file_by_path
from app.services.watchdog import tail_file

class OpenFolderRequest(BaseModel):
    path: str


router = APIRouter(prefix="/api/log", tags=["Log"])
 

@router.post("/upload")
async def upload_log(file: UploadFile = File(...)):
    return save_uploaded_file(file)

#route for opening file from folder tree
@router.get("/file/content")
def get_file_content_by_path(path: str):
    return read_file_by_path(path)

@router.get("/file/watch")
async def watch_file(path: str, request: Request):
    return StreamingResponse(
        tail_file(path, request),
        media_type="text/event-stream",
    )

#route for loading file
@router.get("/{file_id}/content")
def get_log_content(file_id: str):
    content = read_saved_file(file_id)

    return {
        "fileId": file_id,
        "content": content
    }

#route for recieveing folder path
@router.post("/folder/open")
async def open_folder(request: OpenFolderRequest):
    return scan_folder(request.path)

