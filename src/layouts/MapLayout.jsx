import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarMap from "../components/mapmonitor/SideBarMap";
import apiClient from "../utils/apiClient";
import { MapLayContext } from "../utils/Contexts";

const MapLayout = () => {
  const [mapSelect, setMapSelect] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [listMapView, setListMapView] = useState([]);
  const [boundaries, setBoundaries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodes, mapViews, _boundaries] = await Promise.all([
          apiClient.get("/nodes"),
          apiClient.get("/mapview"),
          apiClient.get("/boundaries")
        ]);
        setMarkers(nodes);
        setListMapView(mapViews);
        setBoundaries(_boundaries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MapLayContext.Provider value={{ mapSelect, setMapSelect, markers, listMapView, boundaries }}>
      <SideBarMap setIsSidebarVisible={setIsSidebarVisible} isSidebarVisible={isSidebarVisible} />
      <div className="h-full relative transition-all duration-300 ease-in-out w-full">
        <div className="relative w-full h-full">
          <Outlet />
        </div>
      </div>
    </MapLayContext.Provider>
  );
};

export default MapLayout;
