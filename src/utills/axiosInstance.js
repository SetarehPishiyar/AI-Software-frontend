import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post(
            "http://localhost/api/auth/token/refresh",
            { refresh }
          );
          localStorage.setItem("access", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          localStorage.clear();
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error("No refresh token"));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
