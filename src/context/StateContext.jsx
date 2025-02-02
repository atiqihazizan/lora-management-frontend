import { toast, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { StateContext } from "../utils/Contexts";
import PropTypes from "prop-types";
import apiClient from "../utils/apiClient";
import DialogChangePassword from "../components/DialogChangePassword";

// const StateContext = createContext({
//   login: () => console.warn("Authentication not implemented"),
//   logout: () => console.warn("Authentication not implemented"),
//   notify: () => console.warn("Notification not implemented"),
//   userToken: null,
//   userInfo: null,
//   devices: [],
//   tiles: [],
//   handleFocus: () => { },
//   setIsChangePasswordOpen: () => { },
// });

// export const useStateContext = () => useContext(StateContext);

export default function StateProvider ({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem("authToken") || "");
  const [userInfo, setUserInfo] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State untuk dialog

  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/devices");
        return response;
      } catch (error) {
        console.error("Error fetching devices:", error);
        return [];
      }
    },
    staleTime: 60000,
    cacheTime: 300000,
  });

  const { data: tiles = [], isLoading: tilesLoading } = useQuery({
    queryKey: ["tiles"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/tiles");
        return response;
      } catch (error) {
        console.error("Error fetching tiles:", error);
        return [];
      }
    },
    staleTime: 60000,
    cacheTime: 300000,
  });

  const { isLoading: isUserLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const { user } = await apiClient.get("/auth/me");
        setUserInfo(user)
        return user;
      } catch (error) {
        // console.error("Failed to fetch user info:", error.response?.data.error);
        // notify("error", "Failed to fetch user info.");
        logout()
        return error;
      }
    },
    enabled: !!userToken, // Only fetch if userToken exists
    staleTime: 60000,
    cacheTime: 300000,
  });

  const login = async (username, password) => {
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      const { token, user } = response;
      localStorage.setItem("authToken", token);
      setUserToken(token);
      setUserInfo(user)
      return true;
    } catch (error) {
      notify("error", "Login failed. Please check your credentials.");
      console.error("Login failed:", error.response?.data?.error || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserToken(null);
    setUserInfo(null)
    console.log("Logged out");
  };

  const notify = (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  const verifyToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now();
      const expiryTime = payload.exp * 1000;

      if (expiryTime < currentTime) {
        notify("warning", "Session expired. Logging out...");
        logout();
      } else {
        setUserInfo({ user_id: payload.user_id, username: payload.username });
        setUserToken(token);
        refreshAuthToken(token);
      }
    } catch (error) {
      console.error("Invalid token:", error.message);
      logout();
    }
  };

  const refreshAuthToken = async (token) => {
    try {
      const response = await apiClient.post("/auth/refresh", { token });
      const newToken = response.token;
      localStorage.setItem("authToken", newToken);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  const handleFocus = () => {
    const token = localStorage.getItem("authToken");

    if (!token && userToken) logout();
    if (!token || !userToken) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now();
      const expiryTime = payload.exp * 1000;
      const remainingTime = expiryTime - currentTime;

      if (remainingTime <= 60000 && remainingTime > 0) {
        notify("warning", "Your session will expire in 1 minute. Please save your work.");
      }

      verifyToken(token);
    } catch (error) {
      console.error("Failed to handle focus event:", error.message);
      logout();
    }
    return false;
  };

  return (
    <StateContext.Provider
      value={{
        login,
        logout,
        notify,
        userToken,
        userInfo,
        devices,
        tiles,
        isUserLoading,
        devicesLoading,
        tilesLoading,
        handleFocus,
        setIsChangePasswordOpen,
      }}
    >
      {children}
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Change Password Dialog */}
      {userToken && isChangePasswordOpen && <DialogChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />}
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

