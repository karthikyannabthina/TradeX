import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {
      refreshToken,
    },
    {
      withCredentials: true,
    }
  );

  const data = response.data;
  const result = data?.data || data;

  const newToken = result?.accessToken;
  const newRefreshToken = result?.refreshToken;

  if (!newToken) {
    throw new Error("Refresh token did not return an access token");
  }

  localStorage.setItem("accessToken", newToken);

  // Backend rotates the refresh token
  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  return newToken;
};

/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */

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

/* =========================================================
   RESPONSE INTERCEPTOR
   ========================================================= */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;

    const isRefreshRequest =
      originalRequest?.url?.includes("/auth/refresh");

    const isLoginRequest =
      originalRequest?.url?.includes("/auth/login");

    const isRegisterRequest =
      originalRequest?.url?.includes("/auth/register");

    /*
     * Do not try refreshing for:
     * - refresh itself
     * - login
     * - registration
     */

    if (
      !isUnauthorized ||
      originalRequest?._retry ||
      isRefreshRequest ||
      isLoginRequest ||
      isRegisterRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /*
     * If another request is already refreshing the token,
     * wait for that refresh instead of creating another one.
     */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          originalRequest.headers =
            originalRequest.headers || {};

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      notifyRefreshSubscribers(newToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshSubscribers = [];

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;