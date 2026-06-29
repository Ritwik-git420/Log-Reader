from fastapi import APIRouter, UploadFile, File

from app.services.savefile import save_uploaded_file


router = APIRouter(prefix="/api/log", tags=["Log"])
 

@router.post("/upload")
async def upload_log(file: UploadFile = File(...)):
    return save_uploaded_file(file)

