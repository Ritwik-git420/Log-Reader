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
