import axios from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// Robust API URL detection
let baseURL;

if (isLocal) {
    baseURL = 'http://localhost:8000/api/';
} else if (hostname.match(/^[0-9.]+$/)) {
    // It's an IP address, use port 8000 explicitly
    baseURL = `http://${hostname}:8000/api/`;
} else {
    // It's a domain name (like duckdns.org)
    // Try to see if there's a port in the URL, if not, use the same protocol as the page
    baseURL = `${protocol}//${hostname}${window.location.port ? ':8000' : ''}/api/`;
}

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