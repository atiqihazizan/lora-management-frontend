import { GeoJSON } from "react-leaflet";
import { useContext, useMemo } from "react";
import { MapLayContext } from "../../utils/Contexts";

function MapBoundaries() {
  const context = useContext(MapLayContext) || { markers: [], boundaries: [] };
  const { boundaries } = context;

  // Validate and process boundaries
  const validBoundaries = useMemo(() => {
    try {
      return (boundaries || []).filter(b => {
        // Validate GeoJSON data
        return b && 
               b.data && 
               typeof b.data === 'object' &&
               b.data.type && 
               b.data.features;
      });
    } catch (error) {
      console.error('Error processing boundaries:', error);
      return [];
    }
  }, [boundaries]);

  return validBoundaries.map((b, i) => {
    try {
      return (
        <GeoJSON
          key={`boundary_${b.id || i}`}
          data={b.data}
          style={{
            color: b.color || "#3388ff",
            weight: b.weight || 2,
            fillOpacity: b.fillOpacity || 0.1
          }}
          onEachFeature={(feature, layer) => {
            try {
              layer.bindTooltip(b.name || `Boundary ${i + 1}`, {
                permanent: true,
                direction: "center",
                className: "custom-tooltip",
              });
            } catch (tooltipError) {
              console.error('Error binding tooltip:', tooltipError);
            }
          }}
        />
      );
    } catch (boundaryError) {
      console.error('Error rendering boundary:', boundaryError, b);
      return null;
    }
  }).filter(Boolean); // Remove null boundaries
}

export default MapBoundaries;
