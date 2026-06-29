import os
import shutil
import uuid

UPLOAD_DIR = "uploads"

#make dir if dont exist for temp saving file    
os.makedirs(UPLOAD_DIR, exist_ok=True) 


def save_uploaded_file(file):
    file_id = str(uuid.uuid4())

    #preserves file type lets say server.log - stores .log
    extension = os.path.splitext(file.filename)[1]

    saved_name = f"{file_id}{extension}"   

    #builds path by itself as can differ for linux and windows
    file_path = os.path.join(UPLOAD_DIR, saved_name)

    #creates a new file in system and copy contents into it, buffer points to that file nad it auto closes
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "id": file_id,
        "filename": file.filename,
        "path": file_path
    }