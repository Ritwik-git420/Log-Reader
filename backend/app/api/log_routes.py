from fastapi import APIRouter, UploadFile, File

from app.services.savefile import save_uploaded_file


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