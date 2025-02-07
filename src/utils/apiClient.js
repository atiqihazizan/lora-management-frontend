// apiClient.js
import axios from "axios";
const isDebug = false;

const axiosInstance = axios.create({
  baseURL: window._env_.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Default timeout 30s
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Don't set Content-Type for FormData (let browser set it)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errMsg;
    if (error.response) {
      // Server responded with error status
      errMsg = `Error ${error.response.status}: ${
        error.response.data?.message || error.response.statusText
      }`;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          break;
        case 413:
          errMsg = "File size too large";
          break;
        case 415:
          errMsg = "Unsupported file type";
          break;
      }
    } else if (error.request) {
      // Request made but no response
      errMsg = error.code === 'ECONNABORTED' 
        ? "Request timeout" 
        : "No response from server";
    } else {
      // Error in request configuration
      errMsg = error.message;
    }
    
    if (isDebug) console.error(errMsg);
    return Promise.reject(new Error(errMsg));
  }
);

const apiClient = {
  get: (endpoint, config = {}) =>
    axiosInstance
      .get(endpoint, config)
      .then((res) => res.data)
      .catch(handleError("GET")),
      
  post: (endpoint, body, config = {}) =>
    axiosInstance
      .post(endpoint, body, config)
      .then((res) => res.data)
      .catch(handleError("POST")),
      
  put: (endpoint, body, config = {}) =>
    axiosInstance
      .put(endpoint, body, config)
      .then((res) => res.data)
      .catch(handleError("PUT")),
      
  delete: (endpoint, config = {}) =>
    axiosInstance
      .delete(endpoint, config)
      .then((res) => res.data)
      .catch(handleError("DELETE")),
      
  // Helper for file uploads
  upload: (endpoint, file, other, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(other).forEach((key) => {
      formData.append(key, other[key]);
    })
    
    return axiosInstance
      .post(endpoint, formData, {
        timeout: 60000, // Longer timeout for uploads
        onUploadProgress: onProgress && ((e) => {
          const percentCompleted = Math.round((e.loaded * 100) / e.total);
          onProgress(percentCompleted);
        }),
      })
      .then((res) => res.data)
      .catch(handleError("UPLOAD"));
  }
};

function handleError(method) {
  return (error) => {
    if (isDebug) {
      console.error(`${method} request failed:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    throw error;
  };
}

export default apiClient;
