from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

from app.services.savefile import save_uploaded_file, read_saved_file
from app.services.foldertree import scan_folder


class OpenFolderRequest(BaseModel):
    path: str


router = APIRouter(prefix="/api/log", tags=["Log"])
 

@router.post("/upload")
async def upload_log(file: UploadFile = File(...)):
    return save_uploaded_file(file)

@router.get("/{file_id}/content")
def get_log_content(file_id: str):
    content = read_saved_file(file_id)

    return {
        "fileId": file_id,
        "content": content
    }

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
