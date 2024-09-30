import axios from "axios";

// const baseURL = "http://localhost:8000/api/"; // test localhost environment ...
const baseURL = "https://ims-backend.up.railway.app/api/"; // on railway.app testing...
const AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default AxiosInstance;
