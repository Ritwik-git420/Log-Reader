export type FileNode = {
    name: string;
    path: string;
    type: "file" | "folder";
    children?: FileNode[];
};

export type OpenFolderRequest = {
    path: string;
};