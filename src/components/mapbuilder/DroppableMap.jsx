import React, { useRef } from "react";
import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useMapContext, useStateContext } from "../../utils/useContexts.js";
import { FaLocationCrosshairs } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import DroppableAdded from "./DroppableAdded.jsx";
import DroppableMarker from "./DroppableMarker.jsx";
import BoundariesMap from "./BoundariesMap.jsx";

const DroppableMap = ({ id, mapview, center }) => {
  const { tiles } = useStateContext();
  const { markers } = useMapContext()
  const mainMapRef = useRef()

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  if (!tiles) return <></>
  return (
    <div className="relative h-full w-full">
      <>
        <MapContainer
          className="h-full w-full flex-1 mainmap"
          ref={mainMapRef}
          center={center}
          zoom={mapview?.zoom || 15}
          attributionControl={false}
          zoomControl={false}
        >
          {tiles && (
            <LayersControl position="bottomleft" >
              {tiles.map((tile, idx) => (
                <LayersControl.BaseLayer key={`tile_${idx}`} checked={idx === 0} name={tile.name}>
                  <TileLayer url={tile.url} attribution="&copy;contributo" />
                </LayersControl.BaseLayer>
              ))}
            </LayersControl>
          )}

          <DroppableAdded accept="point" mapid={id} />

          <BoundariesMap mapview={mapview} />

          {markers.map((marker, key) => (<DroppableMarker key={key} marker={marker} accept="feat" />))}
          
          <ZoomControl position="topleft" />
          <button className="btn-location-center" onClick={() => mainMapRef.current && mainMapRef.current.setView(mapview.latlng, mapview.zoom)}>
            <FaLocationCrosshairs className="h-7 w-7 text-gray-500" />
          </button>
        </MapContainer>
      </>
    </div>
  );
};

export default React.memo(DroppableMap);

