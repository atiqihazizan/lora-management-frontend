import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useStateContext } from "../utils/useContexts";
import MapProvider from "../context/MapContext"; // Import DragProvider
import apiClient from "../utils/apiClient";
import MapToolbar from "../components/mapbuilder/MapToolbar";
import Loading from "../components/Loading";
import MapEditor from "../components/mapbuilder/MapEditor";

const MapBuilder = () => {
  const { id } = useParams();
  const { devices} = useStateContext();
  const [center, setCenter] = useState();
  const [nodes, setNodes] = useState([]);
  const [mapView, setMapView] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState({ type: "FeatureCollection", features: [] });

  const { data, isLoading, error: mapviewError } = useQuery({
    queryKey: ['mapview', id],
    queryFn: async () => await apiClient.get(`/boundaries/${id}`),
    enabled: !!id,
    staleTime: 0,
    // staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  // Gabungkan semua kesan apabila `data` berubah
  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setGeoJsonData(data.geojsonData);
      setMapView(data.boundary);
      setCenter (data.boundary?.latlng);
    }
  }, [data]);

  const isError = mapviewError;
  const errorMessage = mapviewError?.message;

  if (isLoading) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-gray-600">
      <MapProvider defaultMarkers={nodes || []} defaultGeoJson={geoJsonData} >
        <MapToolbar devices={devices} siteName={mapView?.name} />
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
        center && <MapEditor data={mapView} />
        }
      </MapProvider>
    </div>
  );
};

export default MapBuilder;
