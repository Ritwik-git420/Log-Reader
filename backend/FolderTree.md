# Folder Tree Notes

- Entries store the whole directory as a `DirEntry` object.

## Example folder

- Suppose the folder looks like this:

```text
C:\Logs
├── 📁 Backend
├── 📁 Frontend
├── 📄 app.log
├── 📄 error.log
└── 📄 notes.txt
```

- Conceptually, `entries` contains:

```text
[
  Backend,
  Frontend,
  app.log,
  error.log,
  notes.txt
]
```

## Important detail

- These are not strings.
- They are `DirEntry` objects.
- A `DirEntry` is a small object describing one thing inside the folder.

## Example: folder entry

- For example, `Backend` is represented as:

```text
DirEntry
├── name = "Backend"
├── path = "C:\Logs\Backend"
├── is_dir() = True
└── is_file() = False
```

## Example: file entry

- Similarly, `app.log` becomes:

```text
DirEntry
├── name = "app.log"
├── path = "C:\Logs\app.log"
├── is_dir() = False
└── is_file() = True
```

## Directory vs File

- A directory (folder) can contain other things.
- A file contains data.
- A file cannot contain more files.

## Simple difference

- Folder → contains children
- File → contains data

- That is the biggest difference.