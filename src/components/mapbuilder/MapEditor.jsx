import { 
  MapContainer, 
  TileLayer, 
  LayersControl, 
  ZoomControl 
} from "react-leaflet";
import { useCallback, useEffect } from "react";
import { useStateContext, useMapContext } from "../../utils/useContexts";
import { CenterButton } from "./MapControls";
import BuildBoundary from "./BuildBoundary.jsx";
import useHandleMapEditor from "./useHandleMapEditor";
import BoundaryMarker from "./BoundaryMarker.jsx";
import DroppedMarker from "./DroppedMarker.jsx";
import DevicesMarker from "./DevicesMarker.jsx";

const MapEditor = ({ data }) => {
  const { markers } = useMapContext();
  const { zoom, id, latlng, name } = data || {};
  const { tiles } = useStateContext();
  const {
    handleDragEnd,
    handleToCenter,
    mainMapRef,
    markerRef
  } = useHandleMapEditor(id, latlng);

  const onBoundaryDragEnd = useCallback((lat, lng) => {
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.error('Invalid coordinates:', { lat, lng });
      return;
    }
    handleDragEnd(lat, lng);
  }, [handleDragEnd]);

  if (!tiles ||  !data || !latlng) {
    console.error('Missing required data:', { tiles, data });
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
        dragging={false}
        doubleClickZoom={false}
      >
        <LayersControl position="bottomleft">
          {tiles?.map((tile, i) => (
            <LayersControl.BaseLayer
              key={i}
              checked={i === 0}
              name={tile.name}
            >
              <TileLayer url={tile.url} attribution={tile.attribution} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        {data && latlng && (
          <BoundaryMarker
            markerRef={markerRef}
            boundary={data}
            onDragEnd={onBoundaryDragEnd}
          />
        )}

        <DroppedMarker accept="point" mapid={id} />
        <BuildBoundary id={id} />
        <ZoomControl position="topleft" />
        <CenterButton onClick={handleToCenter} />

        {data && latlng && <DevicesMarker />}
      </MapContainer>
    </div>
  );
};

export default MapEditor;
