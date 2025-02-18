import { GeoJSON } from "react-leaflet";
import { useMapGuestContext } from "../../utils/useContexts";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { useMemo } from "react";
import Loading from "../Loading";

function MapBoundaries({geojsonData}) {
  return (
    <GeoJSON
      data={geojsonData}
      style={{
        color: geojsonData?.color || "#3388ff",
        weight: geojsonData?.weight || 2,
        fillOpacity: geojsonData?.fillOpacity || 0.1,
      }}
      // onEachFeature={(feature, layer) => {
      //   try {
      //     layer.bindTooltip(geojsonData?.name || map?.name, {
      //       permanent: true,
      //       direction: "center",
      //       className: "custom-tooltip",
      //     });
      //   } catch (tooltipError) {
      //     console.error('Error binding tooltip:', tooltipError);
      //   }
      // }}
    />
  );
}

export default MapBoundaries;
