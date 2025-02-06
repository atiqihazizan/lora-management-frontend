import { MapContainer, TileLayer, ZoomControl, LayersControl} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMapLayerContext, useStateContext } from "../utils/useContexts";
import MapBoundaries from "../components/mapmonitor/MapBoundaries";
import MapMarkers from "../components/mapmonitor/MapMarkers";
import MapTrackers from "../components/mapmonitor/MapTrackers";
import BoundaryMarker from "../components/mapmonitor/BoundaryMarker";
import SideBarMap from "../components/mapmonitor/SideBarMap";
import apiClient from "../utils/apiClient";

const DEFAULT_CENTER = [4.5141, 102.0511]; // Adjusted more west between Kelantan and Pahang
const DEFAULT_ZOOM = 8;

// Fly to options for smoother animation
const flyToOptions = {
  duration: 2.5,
  easeLinearity: 0.1,
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

  // Fetch boundaries on mount
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const response = await apiClient.get("/geofance");
        setBoundaries(response);
      } catch (error) {
        console.error("Error fetching boundaries:", error);
      }
    };
    fetchBoundaries();
  }, []);

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

  // Function to handle flying to location
  const flyToLocation = (coords, zoom = DEFAULT_ZOOM, boundary = null) => {
    mapRef.current?.flyTo(coords, zoom, {
      ...flyToOptions,
      complete: () => {
        setSelectedBoundary(boundary ? { ...boundary, center: coords } : null);
      }
    });
  };

  // Effect to handle flying to boundary when slug changes
  useEffect(() => {
    if (!mapRef.current) return;

    // If no slug, fly to default center
    if (!slug) {
      flyToLocation(DEFAULT_CENTER);
      return;
    }

    // If no boundaries yet, do nothing
    if (!boundaries) return;

    // Find boundary by slug
    const boundary = boundaries.find(b => b.slug === slug);
    if (!boundary) {
      flyToLocation(DEFAULT_CENTER);
      return;
    }

    // Parse coordinates
    const coords = parseLatlng(boundary.latlng);
    if (!coords) {
      console.error('Invalid boundary latlng:', boundary);
      flyToLocation(DEFAULT_CENTER);
      return;
    }

    // Fly to boundary location
    flyToLocation(coords, boundary.zoom || 15, boundary);
    setSelectedBoundary(boundary);
  }, [slug, boundaries]);

  return (
    <div className="relative h-screen">
      <SideBarMap 
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        mapRef={mapRef}
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

        {/* <MapBoundaries /> */}
        <MapMarkers />
        {/* <MapTrackers /> */}
        {selectedBoundary && selectedBoundary.latlng && (
          <BoundaryMarker boundary={selectedBoundary} />
        )}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default MapMonitor;
