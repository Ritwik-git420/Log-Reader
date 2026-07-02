import api from "./api";

export type UploadLogResponse = {
    fileId: string;
    filename: string;
    path: string;
};
// type for loading file from backend
export type LogContentResponse = {
	fileId: string;
	content: string;
};

export async function uploadLog(file: File): Promise<UploadLogResponse> {

    const formData = new FormData();

    //file selected by user from sidebar which passed to this function as a prop
    formData.append("file", file);
    
    const response = await api.post<UploadLogResponse>(
        "/log/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}
//call to backend to load file
export async function getLogContent(fileId: string): Promise<LogContentResponse> {
	const response = await api.get<LogContentResponse>(`/log/${fileId}/content`);
	return response.data;
}


