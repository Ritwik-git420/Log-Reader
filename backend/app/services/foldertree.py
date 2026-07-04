import os
#Take a folder path, check if it's valid, then look at everything inside that folder.
def scan_folder(path):


    if not os.path.isdir(path):
        return {
            "message": "Invalid folder path"
        }
    
    # Create the root folder object
    folder_node = {
        "name": os.path.basename(path),
        "path": path,
        "type": "folder",
        "children": []
    }
    
    entries = os.scandir(path)

    for entry in entries:
        #code for appending file
        if entry.is_file():
            if entry.name.endswith((".log", ".txt")):
                file_node = {
                    "name": entry.name,
                    "path": entry.path,
                    "type": "file"
                }
                folder_node["children"].append(file_node)
             
        #this appends folder
        elif entry.is_dir():
            directory_node = {
                "name": entry.name,
                "path": entry.path,
                "type": "folder"
            }

            folder_node["children"].append(directory_node)

    return folder_node