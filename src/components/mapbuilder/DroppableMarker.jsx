import { Marker, useMap } from "react-leaflet";
import { useState, useCallback } from "react";
import { formatLatLong } from "../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { MapContext } from "../../context/Contexts";
import PropTypes from "prop-types";
import IconMarker from "../IconMarker";
import apiClient from "../../utils/apiClient";
import React from "react";
import WaveCircle from "../WaveCircle";

const DroppableMarker = (({ marker }) => {
  const map = useMap(); // Get map instance
  const queryClient = useQueryClient();
  const { setMarkers, openMarkerDialog } = useContext(MapContext);
  const [center, setCenter] = useState(() => marker?.latlng.split(",").map((c) => parseFloat(c)));
  const radius = marker?.prop ? marker?.prop?.find(p => p.key === 'radius')?.val || 0 : 0;

  const onDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng();
      const newLatLng = formatLatLong([lat, lng].join(","));
      setCenter([lat, lng]);

      apiClient.put(`/nodes/${marker.id}`, { latlng: newLatLng }).then(() => {
        setMarkers((prev) =>
          prev.map((m) => (m.id === marker.id ? { ...m, latlng: newLatLng } : m))
        );
        queryClient.invalidateQueries(["mapview", marker.id]);
      });
    },
    [marker, setMarkers, queryClient]
  );

  const onDragEvent = useCallback((e) => {
    const markerElement = e.target._icon;
    markerElement.style.zIndex = 1000; // Set z-index tinggi untuk marker yang di-klik
  }, []);

  const handleMouseDown = onDragEvent;
  const handleMouseOver = onDragEvent;
  const editMarker = () => openMarkerDialog({ ...marker, prop: JSON.stringify(marker.prop) }, () => { })

  return (
    <>
      <Marker position={center} icon={IconMarker({ ...marker, prop: marker.prop })} draggable={true} eventHandlers={{
        dragend: onDragEnd,
        dblclick: editMarker,
        mousedown: handleMouseDown,
        mouseover: handleMouseOver,
      }} />
      <WaveCircle map={map} radius={radius} center={center} />
    </>
  );
});

DroppableMarker.propTypes = {
  marker: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    latlng: PropTypes.string.isRequired,
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    name: PropTypes.string,
    topic: PropTypes.string,
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  accept: PropTypes.string.isRequired,
};

export default React.memo(DroppableMarker);
