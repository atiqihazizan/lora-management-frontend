import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useStateContext } from "../utils/useContexts";
import MapProvider from "../context/MapContext"; // Import DragProvider
import apiClient from "../utils/apiClient";
import DroppableMap from "../components/mapbuilder/DroppableMap";
import MapToolbar from "../components/mapbuilder/MapToolbar";
import Loading from "../components/Loading";

const MapBuilder = () => {
  const { id } = useParams();
  const { devices, tiles } = useStateContext();
  const [initTileLayer, setTileLayer ] = useState();

  const { data: mapview, isLoading, error: mapviewError } = useQuery({
    queryKey: ['mapview', id],
    queryFn: async () => {
      const response = await apiClient.get(`/mapview/nodes/${id}`);
      setTileLayer(response.tile_url); // Set tileLayer dengan tile_url atau default
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const isError = mapviewError;
  const errorMessage = mapviewError?.message;

  if (isLoading) return <Loading />;

  const defaultGeoJson = (() => {
    try {
      return mapview?.bounding ? JSON.parse(mapview.bounding) : {};
    } catch (error) {
      console.error("Error parsing geoJson:", error);
      return {};
    }
  })();

  return (
    <div className="h-full flex flex-col bg-gray-600">
      <MapProvider defaultMarkers={mapview?.nodes || []} defaultGeoJson={defaultGeoJson} initTileLayer={initTileLayer}>
        <MapToolbar devices={devices} />
        {isLoading ? (
          <div className="spinner m-auto"></div>
        ) : isError ? (
          <div className="m-auto text-center">
            <p>Error: {errorMessage}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Try Again
            </button>
          </div>
        ) :
          mapview && <DroppableMap id={id} mapview={mapview} tiles={tiles} />
        }
      </MapProvider>
    </div>
  );
};

export default MapBuilder;
