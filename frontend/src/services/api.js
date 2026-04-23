import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

// Request Interceptor — token add பண்ணு
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Request token:", token ? "exists" : "missing"); // debug
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor — 401 வந்தா logout பண்ணாதே இப்போ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.status, error.config?.url);
    // Payment routes la logout பண்ணாதே
    const isPaymentRoute = error.config?.url?.includes("create-order") ||
                           error.config?.url?.includes("verify-payment");
    
    if (error.response?.status === 401 && !isPaymentRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;