import { Marker, useMap } from "react-leaflet";
import { useState, useCallback } from "react";
import { formatLatLong, latlngToArray } from "../../utils/components";
import { useQueryClient } from "@tanstack/react-query";
import { useMapContext } from "../../utils/useContexts";
import PropTypes from "prop-types";
import IconMarker from "../IconMarker";
import apiClient from "../../utils/apiClient";
import React from "react";
import WaveCircle from "../WaveCircle";

const MarkerDraggable = (({ marker }) => {
  const map = useMap(); // Get map instance
  const queryClient = useQueryClient();
  const { setMarkers, openMarkerDialog } = useMapContext();
  const [center, setCenter] = useState(() => marker?.latlng);
  const radius = Array.isArray(marker?.prop) ? marker?.prop?.find(p => p.key === 'radius')?.val || 0 : 0;

  const onDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng();
      const newLatLng = formatLatLong([lat, lng].join(","));
      setCenter([lat, lng]);

      apiClient.put(`/nodes/${marker.id}`, { latlng: newLatLng }).then(() => {
        setMarkers((prev) =>
          prev.map((m) => (m.id === marker.id ? { ...m, latlng: latlngToArray(newLatLng) } : m))
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

MarkerDraggable.propTypes = {
  marker: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    latlng: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    name: PropTypes.string,
    topic: PropTypes.string,
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  accept: PropTypes.string.isRequired,
};

export default React.memo(MarkerDraggable);
