import { GeoJSON } from "react-leaflet";
import { useContext } from "react";
import { MapLayContext } from "../../utils/Contexts";

function MapBoundaries() {
  const context = useContext(MapLayContext) || { markers: [], boundaries: [] };
  const { boundaries } = context;

  return boundaries?.map((b, i) => (
    <GeoJSON
      key={`boundary_${i}`}
      data={b.data}
      style={{ color: "#3388ff", weight: 2, fillOpacity: 0.1 }}
      onEachFeature={(feature, layer) => {
        layer.bindTooltip(b.name || `Feature ${i + 1}`, {
          permanent: true,
          direction: "center",
          className: "custom-tooltip",
        });
      }}
    />
  ))
}

export default MapBoundaries;
