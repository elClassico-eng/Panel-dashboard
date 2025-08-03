// Setting Axios & Interceptors
import axios from "axios";
import { authServices } from "@/services/AuthServices";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests
    headers: { "Content-Type": "application/json" },
});

// JWT Interceptor
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

// Setting JWT & Refresh Token
$api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const { data } = await authServices.refreshToken();
                localStorage.setItem("token", data.accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return $api.request(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
