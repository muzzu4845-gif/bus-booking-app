// api.js — Axios instance, token interceptor
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Every request போகும் முன்னாடி token automatically add ஆகும்
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor ──────────────────────────────────────────────────────
// 401 வந்தா — token expired, logout பண்ணிடு
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;