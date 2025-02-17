import { GeoJSON } from "react-leaflet";
import { useMapGuestContext } from "../../utils/useContexts";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { useMemo } from "react";
import Loading from "../Loading";

function MapBoundaries() {
  const { mapSelect } = useMapGuestContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mapview", mapSelect?.id],
    queryFn: async () => await apiClient.get(`/maps/${mapSelect?.id}`),
    enabled: !!mapSelect?.id,
    staleTime: 1000 * 60 * 5, // Cache data selama 5 minit
    refetchOnWindowFocus: false, // Tidak fetch data baru bila window focus
    refetchOnMount: false, // Tidak fetch data baru bila component mount
    cacheTime: 1000 * 60 * 10, // Simpan cache selama 10 minit
  });
  if (isLoading) return <Loading />;
  if (error) return "An error has occurred: " + error.message;
  const { geojsonData = []} = data || {};
console.log(1234)

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
