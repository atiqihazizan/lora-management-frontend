import { MapContainer, TileLayer, ZoomControl, LayersControl} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMapGuestContext, useStateContext } from "../utils/useContexts";
import BoundaryNodes from "../components/mapmonitor/BoundaryNodes";
import BoundaryMarker from "../components/mapmonitor/BoundaryMarker";
import SideBarMap from "../components/mapmonitor/SideBarMap";
import apiClient from "../utils/apiClient";
import MapBoundaries from "../components/mapmonitor/MapBoundaries";
import DevicesNode from "../components/mapmonitor/DevicesNode";

const DEFAULT_CENTER = [4.5141, 102.0511]; // Adjusted more west between Kelantan and Pahang
const DEFAULT_ZOOM = 8;

// Fly to options for smoother animation
const flyToOptions = {
  duration: 2.5,
  easeLinearity: 0.1,
};

function MapMonitor() {
  const { slug } = useParams();
  const { mapSelect, setMapSelect, guestMaps, setGuestMaps = () => {} } = useMapGuestContext();
  const { tiles, tilesLoading } = useStateContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [center] = useState(DEFAULT_CENTER);
  const [zoom] = useState(DEFAULT_ZOOM);
  const mapRef = useRef();

  // Fetch boundaries on mount
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const response = await apiClient.get("/maps");
        setGuestMaps(response);
      } catch (error) {
        console.error("Error fetching maps:", error);
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
    mapRef.current?.flyTo(coords, zoom, { ...flyToOptions });
  };

  // Effect to handle flying to boundary when slug changes
  useEffect(() => {
    if (!mapRef.current) return;

    // If no slug, fly to default center
    if (!slug) return;

    // If no boundaries yet, do nothing
    if (!guestMaps) return;

    // Find boundary by slug
    const boundary = guestMaps.find(b => b.slug === slug);
    if (!boundary) return;

    // Parse coordinates
    const coords = parseLatlng(boundary.latlng);
    if (!coords) {
      console.error('Invalid boundary latlng:', boundary);
      return;
    }

    // Fly to boundary location
    flyToLocation(coords, boundary.zoom || 15);

    mapRef.current.on('moveend', () => setMapSelect(boundary));
    mapRef.current.on('movestart', () => setMapSelect(null));

    return () => {
      if(!mapRef.current) return;
      mapRef.current.off('moveend', () => setMapSelect(null));
      mapRef.current.off('movestart', () => setMapSelect(null));
    };
  }, [slug, guestMaps]);

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

        {mapSelect && mapSelect.latlng && (
          <>
            <MapBoundaries />
            <BoundaryNodes />
            <BoundaryMarker />
            <DevicesNode />
          </>
        )}

        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default MapMonitor;
