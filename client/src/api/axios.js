import axios from "axios";

const API_URI =import.meta.env.VITE_BACKEND_URI;

const API = axios.create({
  baseURL: `${API_URI}/api`,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
