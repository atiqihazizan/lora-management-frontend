import { Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import L from 'leaflet';
import { useMemo } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToString } from "react-dom/server";

const BoundaryMarker = ({ boundary }) => {

  // Create custom marker icon
  const markerIcon = useMemo(() => {
    const position = boundary.latlng.split(",").map(Number);
    const iconHtml = renderToString(
      <div className="flex flex-col items-center" style={{transform: 'translate(-12px, -48px)'}}>
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2 whitespace-nowrap uppercase">{boundary.name}</h3>
          {boundary.description && (
            <p className="text-sm text-gray-600">{boundary.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
        <FaMapMarkerAlt className="w-12 h-12 text-red-500 mt-4" />
      </div>
    );
    return new L.DivIcon({
      className: 'custom-marker',
      html: iconHtml,
      iconSize: [32, 68],
      iconAnchor: [4, 68],
      popupAnchor: [0, -68],
    });
  }, [boundary.name]);

  // Parse latlng if needed
  const position = useMemo(() => {
    if (Array.isArray(boundary.latlng)) return boundary.latlng;
    if (typeof boundary.latlng === 'string') {
      const coords = boundary.latlng.split(',').map(Number);
      if (coords.length === 2 && !coords.some(isNaN)) {
        return coords;
      }
    }
    return null;
  }, [boundary.latlng]);

  // Only render if boundary has valid coordinates
  if (!position) {
    console.error('Invalid boundary position:', boundary);
    return null;
  }

  return (
    <>
    <Marker position={position} icon={markerIcon}>
    </Marker>
    {/* <Marker position={position}></Marker> */}
    </>
  );
};

BoundaryMarker.propTypes = {
  boundary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    latlng: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.string
    ]).isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default BoundaryMarker;
