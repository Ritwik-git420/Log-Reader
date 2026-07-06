import axios from "axios";
//backend url
export const API_BASE_URL = "http://127.0.0.1:8000/api";
 
export default axios.create({
    baseURL: API_BASE_URL,
});