export type FileNode = {
    name: string;
    path: string;
    type: "file";
};

export type FolderNode = {
    name: string;
    path: string;
    type: "folder";
    children: ExplorerNode[];
};

export type ExplorerNode = FileNode | FolderNode;

export type OpenFolderRequest = {
    path: string;
};

export type OpenFolderResponse = FolderNode | { message: string };
