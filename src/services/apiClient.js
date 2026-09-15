import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Central axios instance for the frontend. Use the VITE_API_URL to control
// the full API base path (include /v1 if your backend uses it).
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // enable if backend uses cookies for auth
});

// Attach Authorization header if an access token exists in localStorage.
// Note: prefer httpOnly cookies where possible; this is a pragmatic default
// for apps using bearer tokens stored in memory/localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
