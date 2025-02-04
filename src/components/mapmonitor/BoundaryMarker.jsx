import { Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import L from 'leaflet';
import { useMemo } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const BoundaryMarker = ({ boundary }) => {
  // Create custom marker icon
  const markerIcon = useMemo(() => new L.DivIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 flex items-center justify-center text-red-500">
            <svg viewBox="0 0 384 512" class="w-6 h-6 fill-current">
              ${FaMapMarkerAlt().props.children}
            </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }), []);

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
    <Marker position={position} icon={markerIcon}>
      <Popup>
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">{boundary.name}</h3>
          {boundary.description && (
            <p className="text-sm text-gray-600">{boundary.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
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
