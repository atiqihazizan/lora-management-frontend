import { useEffect, useRef, useState } from 'react';
import { formatLatLong } from "../../utils/components";
import apiClient from "../../utils/apiClient";

const useHandleMapEditor = (id, latlng, userInfo) => {
  const mainMapRef = useRef(null);
  const markerRef = useRef(null);
  const [isChange, setIsChange] = useState(false);

  const onSavePosition = async (latlng) => {
    const map = mainMapRef.current;
    await apiClient.put(`/boundaries/fetures/${id}`, {
      latlng: formatLatLong(latlng),
      userid: userInfo.user_id,
    });
    map.setView(latlng, map.getZoom() || 15);
    setIsChange(latlng);
  };

  const onSaveZoom = async (zoom) => {
    await apiClient.put(`/boundaries/fetures/${id}`, {
      zoom: zoom,
      userid: userInfo.user_id,
    });
  };

  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      onSavePosition([lat, lng]);
    }
  };

  const handleToCenter = () => {
    const map = mainMapRef.current;
    const marker = markerRef.current;
    if (map && markerRef.current) {
      marker.setLatLng(latlng);
      onSavePosition(latlng);
    }
  };

  useEffect(() => {
    if (!mainMapRef.current || !markerRef.current) return;
    const map = mainMapRef.current;
    const marker = markerRef.current;

    const onMoveEnd = () => {
      const { lat, lng } = map.getCenter();
      const markerPosition = marker.getLatLng();
      if (markerPosition.lat !== lat || markerPosition.lng !== lng) {
        setTimeout(() => marker.openPopup(), 200);
      }
    };

    const updateZoom = () => {
      onSaveZoom(map.getZoom());
    };

    map.on("moveend", onMoveEnd);
    map.on("zoomend", updateZoom);

    return () => {
      map.off("moveend", onMoveEnd);
      map.off("zoomend", updateZoom);
    };
  }, [isChange, mainMapRef.current]);

  return { handleDragEnd, handleToCenter, mainMapRef, markerRef, setIsChange };
};

export default useHandleMapEditor;
