import os
#Take a folder path, check if it's valid, then look at everything inside that folder.
def scan_folder(path):


    if not os.path.isdir(path):
        return {
            "message": "Invalid folder path"
        }
    
    entries = os.scandir(path)

    for entry in entries:

        if entry.is_file():
            print("FILE:", entry.name)

        elif entry.is_dir():
            print("DIR :", entry.name)

    return {
        "message": "Folder scanned"
    }