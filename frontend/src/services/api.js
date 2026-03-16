import axios from "axios";

const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// If we're on the VM IP, but on port 5173, the backend is on port 8000
const baseURL = isLocal 
    ? 'http://localhost:8000/api/' 
    : `http://${hostname}:8000/api/`;

const API = axios.create({
    baseURL: baseURL,
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request - token may be invalid or expired");
    }

    return Promise.reject(error);
  }
);

export default API;