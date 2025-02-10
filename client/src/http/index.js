import axios from "axios";

export const API_URL = "http://localhost:7000";

export const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests
    headers: { "Content-Type": "application/json" },
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});
