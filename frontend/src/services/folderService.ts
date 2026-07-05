import api from "./api";
import type { OpenFolderRequest, OpenFolderResponse } from "../types/explorer";

// folder path comes in string format
export async function openFolder(path: string): Promise<OpenFolderResponse> {
    const body: OpenFolderRequest = {
        path,
    };
    //send the path as string to backend
    const response = await api.post<OpenFolderResponse>(
        "log/folder/open",
        body
    );

    return response.data;
}

export type FileContentResponse =
  | { path: string; filename: string; content: string }
  | { message: string };

export async function openFileByPath(path: string): Promise<FileContentResponse> {
  const response = await api.get<FileContentResponse>("log/file/content", {
    params: { path },
  });
  return response.data;
}
