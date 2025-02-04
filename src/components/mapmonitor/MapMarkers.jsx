import { useMap } from "react-leaflet";
import { isObjectNotEmpty } from "../../utils/components";
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
      const center = m?.latlng.split(",").map((c) => parseFloat(c));
      const prop = m?.prop ? JSON.parse(m.prop) : {};
      const radius = isObjectNotEmpty(prop) ? prop?.find((p) => p.key === 'radius')?.val || 0 : 0;
      return { ...m, center, prop: prop, radius };
    });
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
