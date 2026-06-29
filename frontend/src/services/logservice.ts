import api from "./api";

export async function uploadLog(file: File) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
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