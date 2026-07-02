import axios from "axios";
//backend url 
export default axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});