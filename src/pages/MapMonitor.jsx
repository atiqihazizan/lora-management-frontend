import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useMapLayerContext, useStateContext } from "../utils/useContexts";
import L from "leaflet";
import "leaflet-geometryutil";
import MapTrackers from "../components/mapmonitor/MapTrackers";
import MapMarkers from "../components/mapmonitor/MapMarkers";
import MapBoundaries from "../components/mapmonitor/MapBoundaries";

L.Control.Zoom.prototype.options.position = "bottomright";

const MapMonitor = () => {
  const [location, setLocation] = useState([4.2105, 101.9758]); // Default lokasi ke Malaysia
  const {mapSelect} = useMapLayerContext();
  const { tiles, tilesLoading } = useStateContext();
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && mapSelect?.data) {
      const geoJsonLayer = L.geoJSON(mapSelect.data);
      const bounds = geoJsonLayer.getBounds();

      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20], animate: true });
        setLocation(bounds.getCenter());
      }
    }
  }, [mapSelect]);

  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current && !mapRef.current._customControlAdded) {
        const customControl = L.Control.extend({
          options: { position: "bottomright" },
          onAdd: () => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
            container.innerHTML = '<button style="cursor:pointer;width:30px;height:30px;background:white;border-radius:4px;box-shadow:0 1px 5px rgba(0,0,0,0.65);"><i class="fas fa-crosshairs" style="font-size:16px;"></i></button>';
            container.onclick = () => mapRef.current.setView(location, 8, { animate: true });
            return container;
          },
        });
        mapRef.current.addControl(new customControl());
        mapRef.current._customControlAdded = true;
      }
    }, 100);
  }, [location]);

  return (
    <MapContainer
      ref={mapRef}
      center={location}
      zoom={8}
      className="h-full w-full"
      zoomControl
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
    </MapContainer>
  );
};

export default MapMonitor;
