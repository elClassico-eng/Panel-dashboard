// Setting Axios & Interceptors
import axios from "axios";
import { authServices } from "@/services/AuthServices";

export const API_URL = "http://localhost:7000/api";

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
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const { data } = await authServices.refreshToken();
                    console.log("Token refresh success: ", data);
                    localStorage.setItem("token", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);

                    error.config.headers.Authorization = `Bearer ${data.accessToken}`;

                    return $api.request(error.config);
                } catch (error) {
                    console.log("Token refresh failed: ", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                }
            }
            console.log("No refresh token found, redirecting to login");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
