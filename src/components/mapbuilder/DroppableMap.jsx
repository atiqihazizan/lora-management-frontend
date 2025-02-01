import React, { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import PropTypes from 'prop-types';
import DroppableAdded from "./DroppableAdded.jsx";
import DroppableMarker from "./DroppableMarker.jsx";
import MapBottom from "./MapBottom.jsx";
import BoundariesMap from "./BoundariesMap.jsx";
import { isObjectNotEmpty } from "../../utils/constants.jsx";
import { MapContext } from "../../context/Contexts.js";

const DroppableMap = ({ id, mapview, tiles }) => {
  const { tileLayer, markers, currentTileIndex } = useContext(MapContext)
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
          center={mapview.latlng}
          zoom={mapview.zoom}
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer url={tileLayer || tiles?.[currentTileIndex]?.url} />
          {/* <TileLayer url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} /> */}

          <DroppableAdded accept="point" mapid={id} />

          {isObjectNotEmpty(mapview) && <BoundariesMap mapview={mapview} />}

          {markers.map((marker, key) => (<DroppableMarker key={key} marker={marker} accept="feat" />))}
        </MapContainer>

        <MapBottom
          id={id}
          mapview={mapview}
          tiles={tiles}
          handleCenterButtonClick={() => mainMapRef.current && mainMapRef.current.setView(mapview.latlng, mapview.zoom)}
          handleZoomIn={() => mainMapRef.current && mainMapRef.current.zoomIn()}
          handleZoomOut={() => mainMapRef.current && mainMapRef.current.zoomOut()}
        />
      </>
    </div>
  );
};

DroppableMap.propTypes = {
  id: PropTypes.string.isRequired,
  mapview: PropTypes.object.isRequired,
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    })
  ).isRequired,
};

export default React.memo(DroppableMap);

