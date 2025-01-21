// apiClient.js
import axios from "axios";
const isDebug = false;

const axiosInstance = axios.create({
  baseURL: "http://loramesh.mahsites.com/api/", // Tukar kepada URL backend anda
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errMsg = error.response
      ? `Error ${error.response.status}: ${
          error.response.data?.message || error.response.statusText
        }`
      : error.request
      ? "No response from server"
      : error.message;
    if (isDebug) console.error(errMsg);
    return Promise.reject(new Error(errMsg));
  }
);

const apiClient = {
  get: (endpoint) =>
    axiosInstance
      .get(endpoint)
      .then((res) => res.data)
      .catch(handleError("GET")),
  post: (endpoint, body) =>
    axiosInstance
      .post(endpoint, body)
      .then((res) => res.data)
      .catch(handleError("POST")),
  put: (endpoint, body) =>
    axiosInstance
      .put(endpoint, body)
      .then((res) => res.data)
      .catch(handleError("PUT")),
  delete: (endpoint) =>
    axiosInstance
      .delete(endpoint)
      .then((res) => res.data)
      .catch(handleError("DELETE")),
};

function handleError(method) {
  return (error) => {
    if (isDebug) console.error(`${method} request failed: ${error.message}`);
    throw error;
  };
}

export default apiClient;
