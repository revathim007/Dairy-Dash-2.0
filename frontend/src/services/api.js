import axios from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// Robust API URL detection
let baseURL;

if (isLocal) {
    baseURL = 'http://localhost:8000/api/';
} else if (hostname.match(/^[0-9.]+$/)) {
    // It's an IP address, use the same protocol as the page but port 8000
    // Note: If protocol is https, calling an http port 8000 will fail
    baseURL = `${protocol}//${hostname}:8000/api/`;
} else {
    // It's a domain name (like duckdns.org)
    // If we're on a custom domain, the API might be on a subpath /api/ 
    // or on port 8000 of the same domain.
    // Try both: if no port in URL, assume it's a proxy setup
    baseURL = window.location.port 
        ? `${protocol}//${hostname}:8000/api/` 
        : `${window.location.origin}/api/`;
}

console.log("API Base URL:", baseURL);

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