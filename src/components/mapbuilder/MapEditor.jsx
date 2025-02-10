import { 
  MapContainer, 
  TileLayer, 
  LayersControl, 
  ZoomControl 
} from "react-leaflet";
import { useCallback } from "react";
import { useStateContext, useMapContext } from "../../utils/useContexts";
import NodeMarker from "./NodeMarker.jsx";
import BuildBoundary from "./BuildBoundary.jsx";
import useHandleMapEditor from "./useHandleMapEditor";
import BoundaryMarker from "./BoundaryMarker.jsx";
import DroppedMarker from "./DroppedMarker.jsx";
import { CenterButton } from "./MapControls";

const MapEditor = ({ data }) => {
  const { zoom, id, latlng, name } = data || {};
  const { tiles } = useStateContext();
  const { markers } = useMapContext();
  const { 
    handleDragEnd, 
    handleToCenter, 
    mainMapRef, 
    markerRef 
  } = useHandleMapEditor(id, latlng);

  // Handle boundary marker drag end
  const onBoundaryDragEnd = useCallback((lat, lng) => {
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.error('Invalid coordinates:', { lat, lng });
      return;
    }
    handleDragEnd(lat, lng);
  }, [handleDragEnd]);

  if (!tiles || !markers || !data || !latlng) {
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
          <>
            <CenterButton
              onClick={handleToCenter}
              className="bottom-16 left-[10px]"
            />
            <BoundaryMarker
              markerRef={markerRef}
              boundary={data}
              onDragEnd={onBoundaryDragEnd}
            />
          </>
        )}

        <DroppedMarker accept="point" mapid={id} />
        <BuildBoundary id={id} />
        <ZoomControl position="topleft" />

        {markers?.map((marker, i) => (
          <NodeMarker key={i} marker={marker} accept="marker" />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapEditor;
