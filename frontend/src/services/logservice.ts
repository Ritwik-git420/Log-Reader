import api from "./api";

export type UploadLogResponse = {
    fileId: string;
    filename: string;
    path: string;
};

export async function uploadLog(file: File): Promise<UploadLogResponse> {

    const formData = new FormData();

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
