import { Marker } from "react-leaflet";
import PropTypes from "prop-types";
import L from 'leaflet';
import { useMemo, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToString } from "react-dom/server";

const BoundaryMarker = ({ boundary, onDragEnd, markerRef }) => {
  // Create custom marker icon
  const markerIcon = useMemo(() => {
    const position = boundary.latlng;
    // const iconHtml = renderToString(
    //   <div className="flex flex-col items-center" style={{transform: 'translate(-12px, -48px)'}}>
    //     <div className="text-center shadow-md p-4 mb-2 rounded-lg">
    //       <h3 className="font-bold text-lg mb-1 whitespace-nowrap uppercase">{boundary.name}</h3>
    //       {boundary.description && (
    //         <p className="text-sm text-gray-600">{boundary.description}</p>
    //       )}
    //       <p className="text-xs text-gray-500">
    //         {position[0].toFixed(6)}, {position[1].toFixed(6)}
    //       </p>
    //     </div>
    //     <FaMapMarkerAlt className="w-12 h-12 text-red-500 mt-1" />
    //   </div>
    // );
    const iconHtml = renderToString(
      <div className="flex flex-col items-center" style={{transform: 'translate(-12px, -48px)'}}>
        <div className="text-center bg-transparent p-4 mb-2 rounded-lg">
          <h3 className="font-bold text-2xl mb-1 whitespace-nowrap uppercase">{boundary.name}</h3>
          {boundary.description && (
            <p className="text-lg text-gray-600">{boundary.description}</p>
          )}
          <p className="text-lg text-gray-700">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </div>
    );
    return new L.DivIcon({
      className: 'custom-marker',
      html: iconHtml,
      iconSize: [32, 94],
      iconAnchor: [0, 0],
      popupAnchor: [0, 0],
    });
  }, [boundary.name, boundary.description, boundary.latlng]);

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

  // Handle marker drag end
  const handleDragEnd = useCallback((e) => {
    try {
      if (!e || !e.target) {
        console.error('Invalid drag event:', e);
        return;
      }
      const latLng = e.target.getLatLng();
      if (!latLng || typeof latLng.lat !== 'number' || typeof latLng.lng !== 'number') {
        console.error('Invalid coordinates:', latLng);
        return;
      }
      onDragEnd(latLng.lat, latLng.lng);
    } catch (error) {
      console.error('Error handling drag end:', error);
    }
  }, [onDragEnd]);

  // Only render if boundary has valid coordinates
  if (!position) {
    console.error('Invalid boundary position:', boundary);
    return null;
  }

  return (
    <>
    <Marker
      ref={markerRef}
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd
      }}
    />
    {/* <Marker position={position} /> */}
    </>
  );
};

BoundaryMarker.propTypes = {
  boundary: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    latlng: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.string
    ]).isRequired,
    description: PropTypes.string,
  }).isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

export default BoundaryMarker;
