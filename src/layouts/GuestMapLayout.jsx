import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarMap from "../components/mapmonitor/SideBarMap";
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
        setMarkers(nodes);
        setGuestMaps(maps);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(mapSelect);
    function getBoundaries() {
      
    }
  }, [mapSelect]);

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
