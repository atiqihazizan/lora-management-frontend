import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { MapGuestContext } from "../utils/Contexts";

const GuestMapLayout = () => {
  const [mapSelect, setMapSelect] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [guestMaps, setGuestMaps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodes, maps] = await Promise.all([
          apiClient.get("/nodes"),
          apiClient.get("/maps")
        ]);
        setGuestMaps(maps);
        const newNodes = nodes.map((node) => ({
          ...node,
          prop: node.prop ? JSON.parse(node.prop) : [],
        }));
        setMarkers(newNodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MapGuestContext.Provider value={{ mapSelect, setMapSelect, markers, guestMaps }}>
      <div className="h-full relative transition-all duration-300 ease-in-out w-full">
        <div className="relative w-full h-full">
          <Outlet />
        </div>
      </div>
    </MapGuestContext.Provider>
  );
};

export default GuestMapLayout;
