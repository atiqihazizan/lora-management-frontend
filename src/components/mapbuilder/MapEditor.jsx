import { MapContainer, TileLayer, LayersControl, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useEffect, useCallback } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useStateContext, useMapContext } from "../../utils/useContexts";
import DroppableMarker from "./MarkerDraggable.jsx";
import BuildBoundary from "./BuildBoundary.jsx";
import useHandleMapEditor from "./useHandleMapEditor";
import BoundaryMarker from "./BoundaryMarker.jsx";

const MapEditor = ({ data }) => {
  const { zoom, id, latlng, name } = data || {};
  const { tiles } = useStateContext();
  const { markers } = useMapContext();
  const { handleDragEnd, handleToCenter, mainMapRef, markerRef } = useHandleMapEditor(id, latlng);

  // Handle boundary marker drag end
  const onBoundaryDragEnd = useCallback((lat, lng) => {
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.error('Invalid coordinates:', { lat, lng });
      return;
    }
    handleDragEnd(lat, lng);
  }, [handleDragEnd]);

  // Set default marker icon
  // useEffect(() => {
  //   delete L.Icon.Default.prototype._getIconUrl;
  //   L.Icon.Default.mergeOptions({
  //     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  //     iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  //     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  //   });
  // }, []);

  if (!tiles || !markers || !data) {
    console.error('Missing required data:', { tiles, markers, data });
    return null;
  }
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={latlng}
        zoom={zoom || 13}
        ref={mainMapRef}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
      >
        <LayersControl position="bottomleft">
          {tiles?.map((tile, i) => (
            <LayersControl.BaseLayer key={i} name={tile.name} checked={i === 0}>
              <TileLayer url={tile.url} attribution={tile.attribution} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        {markers?.map((marker, i) => (
          <DroppableMarker key={i} marker={marker} accept="marker" />
        ))}

        <BuildBoundary />

        <button
          onClick={() => handleToCenter()}
          className="absolute bottom-16 left-3 z-[999] rounded-lg bg-white p-2 shadow-lg"
        >
          <FaLocationCrosshairs className="h-7 w-7 text-gray-500" />
        </button>

        {data && latlng && (
          <BoundaryMarker
            markerRef={markerRef}
            boundary={data}
            onDragEnd={onBoundaryDragEnd}
          />
        )}
        <ZoomControl position="topleft" onzoomend={(e) => {
          const zoom = e.target._zoom;
          handleToCenter();
          if (data && latlng) {
            onBoundaryDragEnd(latlng[0], latlng[1]);
          }
          console.log('Zoom changed:', zoom);
        }} />
      </MapContainer>
    </div>
  );
};

export default MapEditor;
