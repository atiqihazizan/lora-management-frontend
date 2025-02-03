import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useMapLayerContext, useStateContext } from "../utils/useContexts";
import L from "leaflet";
import "leaflet-geometryutil";
import MapTrackers from "../components/mapmonitor/MapTrackers";
import MapMarkers from "../components/mapmonitor/MapMarkers";
import MapBoundaries from "../components/mapmonitor/MapBoundaries";
import { useParams } from "react-router";
import apiClient from "../utils/apiClient";

L.Control.Zoom.prototype.options.position = "bottomright";

const MapMonitor = () => {
  const [center, setCenter] = useState([4.2105, 101.9758]); // Default lokasi ke Malaysia
  const [zoom, setZoom] = useState(8);
  const { slug } = useParams()
  const {setMapSelect = () => { },} = useMapLayerContext();
  const { tiles, tilesLoading } = useStateContext();
  const mapRef = useRef();

  useEffect(() => {
    console.log
    const getData = async () => {
      try {
        const {
          boundary,
          nodes = [],
          geojsonData = null,
        } = await apiClient.get("/boundaries/map/" + slug);
        
        const { latlng, zoom } =  boundary
        setCenter(latlng || [4.2105, 101.9758]);
        setZoom(zoom || 15);
        setMapSelect(boundary)
        mapRef.current.flyTo(latlng, zoom, { animate: true });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if(slug) {
      setTimeout(() => getData(), 500);
    }
  }, [slug]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      attributionControl={false}
    >
      {!tilesLoading && (
        <LayersControl position="topright">
          {tiles.map((tile, idx) => (
            <LayersControl.BaseLayer key={`tile_${idx}`} checked={idx === 0} name={tile.name}>
              <TileLayer url={tile.url} attribution="&copy;contributo" />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
      )}

      <MapBoundaries />
      <MapMarkers />
      <MapTrackers />
      <ZoomControl position="topright" />
    </MapContainer>
  );
};

export default MapMonitor;
