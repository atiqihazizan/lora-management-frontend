import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useStateContext } from "../utils/useContexts";
import MapProvider from "../context/MapContext"; // Import DragProvider
import apiClient from "../utils/apiClient";
import DroppableMap from "../components/mapbuilder/DroppableMap";
import MapToolbar from "../components/mapbuilder/MapToolbar";
import Loading from "../components/Loading";
import L from 'leaflet';

const MapBuilder = () => {
  const { id } = useParams();
  const { devices} = useStateContext();
  const [initTileLayer, setTileLayer] = useState();
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

      if (data.tile_url) {
        setTileLayer(data.tile_url);
      }

      if (data.geojsonData) {
        const geoJsonLayer = L.geoJSON(data.geojsonData);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          const { lat, lng } = bounds.getCenter();
          setCenter([lat, lng]);
        }
      }
    }
  }, [data]);

  const isError = mapviewError;
  const errorMessage = mapviewError?.message;

  if (isLoading) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-gray-600">
      <MapProvider defaultMarkers={nodes || []} defaultGeoJson={geoJsonData} initTileLayer={initTileLayer} >
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
        center && <DroppableMap id={id} mapview={mapView} center={center} />
        }
      </MapProvider>
    </div>
  );
};

export default MapBuilder;
