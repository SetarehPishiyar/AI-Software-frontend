import axios from "axios";

const publicAxiosInstance = axios.create({
  baseURL: "http://localhost/api",
  headers: { "Content-Type": "application/json" },
});

export default publicAxiosInstance;
