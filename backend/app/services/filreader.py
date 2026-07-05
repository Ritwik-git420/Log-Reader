import os

MAX_FILE_SIZE = 10 * 1024 * 1024 ## 10MB cap for now, tune later

def read_file_by_path(path: str):
    if not os.path.isfile(path):
        return {"message": "Invalid file path"}
    
    try:
        if os.path.getsize(path) > MAX_FILE_SIZE:
            return {"message": "File too large to open (10MB limit for now)"}
        
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        return {
            "path": path,
            "filename": os.path.basename(path),
            "content": content,
        }
    except OSError as e:
        return {"message": f"Failed to read file: {e}"}
    except Exception as e:
        # catch-all so an unexpected error never escapes uncaught -
        return {"message": f"Unexpected error reading file: {e}"}