import { MapContainer, TileLayer, ZoomControl, LayersControl } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMapLayerContext, useStateContext } from "../utils/useContexts";
import MapBoundaries from "../components/mapmonitor/MapBoundaries";
import MapMarkers from "../components/mapmonitor/MapMarkers";
import MapTrackers from "../components/mapmonitor/MapTrackers";
import SideBarMap from "../components/mapmonitor/SideBarMap";
import BoundaryMarker from "../components/mapmonitor/BoundaryMarker";
import apiClient from "../utils/apiClient";

const DEFAULT_CENTER = [4.5141, 102.0511]; // Adjusted more west between Kelantan and Pahang
const DEFAULT_ZOOM = 8;

// Fly to options for smoother animation
const flyToOptions = {
  duration: 2.5, // Longer duration
  easeLinearity: 0.1, // More smooth easing
};

function MapMonitor() {
  const { slug } = useParams();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState(null);
  const { setMapSelect = () => {}, boundaries, setBoundaries = () => {} } = useMapLayerContext();
  const { tiles, tilesLoading } = useStateContext();
  const mapRef = useRef();
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  // Fetch boundaries data
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const response = await apiClient.get("/boundaries");
        setBoundaries(response);
      } catch (error) {
        console.error("Error fetching boundaries:", error);
      }
    };
    fetchBoundaries();
  }, [setBoundaries]);

  // Parse latlng string to array
  const parseLatlng = (latlng) => {
    if (Array.isArray(latlng)) return latlng;
    if (typeof latlng === 'string') {
      const coords = latlng.split(',').map(Number);
      if (coords.length === 2 && !coords.some(isNaN)) {
        return coords;
      }
    }
    return null;
  };

  // Effect to handle flying to boundary when slug changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (!slug) {
      // If no slug, zoom out to default center
      mapRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, flyToOptions);
      return;
    }

    // If has slug, find and fly to boundary
    if (!boundaries) return;
    const boundary = boundaries.find(b => b.slug === slug);
    if (!boundary) {
      // If boundary not found, zoom out to default center
      mapRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, flyToOptions);
      return;
    }

    const coords = parseLatlng(boundary.latlng);
    if (!coords) {
      console.error('Invalid boundary latlng:', boundary);
      // If invalid coords, zoom out to default center
      mapRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, flyToOptions);
      return;
    }

    // Fly to boundary location
    mapRef.current.flyTo(coords, boundary.zoom || 15, flyToOptions);
  }, [slug, boundaries]);

  // Handle boundary selection from sidebar
  const handleBoundarySelect = (boundary) => {
    setSelectedBoundary(boundary);
  };

  return (
    <div className="relative h-screen">
      <SideBarMap 
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        mapRef={mapRef}
        onBoundarySelect={handleBoundarySelect}
      />
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
      >
        {!tilesLoading && (
          <LayersControl position="topright">
            {tiles.map((tile, idx) => (
              <LayersControl.BaseLayer key={`tile_${idx}`} checked={idx === 0} name={tile.name}>
                <TileLayer url={tile.url} attribution="&copy; contributors" />
              </LayersControl.BaseLayer>
            ))}
          </LayersControl>
        )}

        <MapBoundaries />
        <MapMarkers />
        <MapTrackers />
        {selectedBoundary && selectedBoundary.center && (
          <BoundaryMarker boundary={selectedBoundary} />
        )}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default MapMonitor;
