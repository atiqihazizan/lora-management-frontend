import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useMapContext, useStateContext } from "../../utils/useContexts.js";
import { FaLocationCrosshairs } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import DroppableAdded from "./DroppableAdded.jsx";
import DroppableMarker from "./MarkerDraggable.jsx";
import BuildBoundary from "./BuildBoundary.jsx";
import useHandleMapEditor from "./useHandleMapEditor";

const MapEditor = ({ data }) => {
  const { zoom, id, latlng, name } = data || {};
  const { userInfo, tiles } = useStateContext();
  const { markers } = useMapContext();
  const { handleDragEnd, handleToCenter, mainMapRef, markerRef } = useHandleMapEditor(id, latlng, userInfo);

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  useEffect(() => {
    setTimeout(() => markerRef.current.openPopup(), 100);
  }, []);

  if (!tiles || !markers) return <></>;
  return (
    <div className="relative h-full w-full">
      <>
        <MapContainer
          className="h-full w-full flex-1 mainmap"
          ref={mainMapRef}
          center={latlng}
          zoom={zoom || 15}
          attributionControl={false}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          dragging={false}
          touchZoom={false}
          whenReady={(map) => {
            mainMapRef.current = map;
          }}>
          {tiles && (
            <LayersControl position="bottomleft">
              {tiles.map((tile, idx) => (
                <LayersControl.BaseLayer
                  key={`tile_${idx}`}
                  checked={idx === 0}
                  name={tile.name}>
                  <TileLayer url={tile.url} attribution="&copy;contributo" />
                </LayersControl.BaseLayer>
              ))}
            </LayersControl>
          )}

          <DroppableAdded accept="point" mapid={id} />
          <BuildBoundary id={id} />

          {markers.map((marker, key) => (
            <DroppableMarker key={key} marker={marker} accept="feat" />
          ))}

          <ZoomControl position="topleft" />

          <button className="btn-location-center" onClick={handleToCenter}>
            <FaLocationCrosshairs className="h-7 w-7 text-gray-500" />
          </button>

          <Marker
            position={latlng}
            ref={markerRef}
            draggable={true} // Aktifkan draggable
            eventHandlers={{ dragend: handleDragEnd }} // Event bila drag selesai
          >
            <Popup autoClose={false} closeOnClick={false}>
              <p className="font-bold text-lg text-center !mb-1 uppercase">
                {name}
              </p>
              <p className="text-center !mt-1">{latlng.join(", ")}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </>
    </div>
  );
};
MapEditor.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    latlng: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
  }),
};

export default React.memo(MapEditor);
