import axios from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;

// Detection for local vs remote
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// IMPORTANT: In production, the API should be on the same hostname as the UI
// If the UI is on port 5173, the API is on port 8000
const baseURL = isLocal 
    ? 'http://localhost:8000/api/' 
    : `${protocol}//${hostname}:8000/api/`;

console.log("--- API CONNECTION DEBUG ---");
console.log("Hostname:", hostname);
console.log("Protocol:", protocol);
console.log("Resolved Base URL:", baseURL);
console.log("----------------------------");

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