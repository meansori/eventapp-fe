import axios from "axios";

const api = axios.create({
  baseURL: "http://10.12.26.93:4000", // Make sure this matches your backend port
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
