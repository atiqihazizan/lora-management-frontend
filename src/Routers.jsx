import { createBrowserRouter, Navigate } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import SettingsLayout from "./layouts/SettingsLayout";
import Devices from "./pages/Devices";
import MapBuilder from "./pages/MapBuilder";
import GuestLayout from "./layouts/GuestLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Settings from "./pages/Settings";
import HeadFootLayout from "./layouts/HeadFootLayout";
import MapLayout from "./layouts/MapLayout";
import NotFoundPage from "./pages/NotFound";
import Tiles from "./pages/Tiles"; // Import the Tiles page
import Users from "./pages/Users"; // Import the Users page
import MapMonitor from "./pages/MapMonitor";
import Geofance from "./pages/geofance";

const routers = createBrowserRouter([
  {
    path: "/map",
    element: <MapLayout />,
    children: [
      { path: "", element: <MapMonitor /> },
      {path:":slug", element: <MapMonitor />}
    ]
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "dashboard", element: <Navigate to="/" /> },
      { path: "", element: <HeadFootLayout />, children: [{ path: "", element: <Geofance /> }] },
      { path: "builder/:id", element: <MapBuilder /> },
      {
        path: "settings", element: <SettingsLayout />, children: [
          { path: "", element: <Settings /> },
          { path: "devices", element: <Devices /> },
          { path: "tiles", element: <Tiles /> }, // Add the Tiles route
          { path: "users", element: <Users /> } // Add the Users route
        ]
      },
    ]
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);

export default routers;
