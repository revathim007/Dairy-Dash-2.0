import axios from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;

// Detection for local vs remote
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// FORCE the API to use the current hostname but port 8000
// This is the most reliable way for Azure VM deployment
const baseURL = isLocal 
    ? 'http://localhost:8000/api/' 
    : `http://${hostname}:8000/api/`;

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