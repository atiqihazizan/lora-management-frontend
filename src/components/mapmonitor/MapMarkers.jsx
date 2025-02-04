import { useMap } from "react-leaflet";
import { isObjectNotEmpty, formatLatLonToArray } from "../../utils/components";
import { useContext, useMemo } from "react";
import { MapLayContext } from "../../utils/Contexts.js";
import WaveCircle from "../WaveCircle";
import MarkerDevices from "./MarkerDevices.jsx";

function MapMarkers() {
  const map = useMap(); // Get map instance
  const context = useContext(MapLayContext) || { markers: [], boundaries: [] };
  const { markers, boundaries } = context;

  const processedMarkers = useMemo(() => {
    return markers?.map((m) => {
      try {
        // Use utility function to handle different latlng formats
        const center = formatLatLonToArray(m?.latlng);
        const prop = m?.prop ? (typeof m.prop === 'string' ? JSON.parse(m.prop) : m.prop) : [];
        const radius = Array.isArray(prop) ? prop.find((p) => p.key === 'radius')?.val || 0 : 0;
        return { ...m, center, prop, radius };
      } catch (error) {
        console.error('Error processing marker:', error, m);
        return null; // Skip invalid markers
      }
    }).filter(Boolean); // Remove null markers
  }, [markers]);

  return boundaries && processedMarkers?.map((m, i) => {
    return (
      <div key={i}>
        <MarkerDevices data={m} />
        <WaveCircle map={map} radius={m.radius} center={m.center} />
      </div>
    );
  });
}

export default MapMarkers;
