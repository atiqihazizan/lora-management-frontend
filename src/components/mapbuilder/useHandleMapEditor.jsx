import { useEffect, useRef, useState, useCallback } from "react";
import { formatLatLong } from "../../utils/components";
import apiClient from "../../utils/apiClient";
import { useStateContext } from "../../utils/useContexts";
import debounce from "lodash.debounce";

const useHandleMapEditor = (id, latlng) => {
  const { userInfo } = useStateContext();
  const mainMapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([]);

  // Save boundary position with debounce
  const debouncedSavePosition = useCallback(
    debounce((newLatLng) => {
      if (!id || !userInfo?.user_id || !Array.isArray(newLatLng)) {
        console.error('Invalid data for saving position:', { id, userInfo, newLatLng });
        return;
      }

      try {
        const formattedLatLng = formatLatLong(newLatLng);
        apiClient.put(`/geofance/fetures/${id}`, {
          latlng: formattedLatLng,
          userid: userInfo.user_id,
        });
        console.log('Position updated:', newLatLng);
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }, 500), // tunggu 500ms sebelum hantar ke backend
    [id, userInfo]
  );

  // Save boundary zoom level with debounce
  const debouncedSaveZoom = useCallback(
    debounce((zoom) => {
      if (!id || !userInfo?.user_id || typeof zoom !== 'number') {
        console.error('Invalid data for saving zoom:', { id, userInfo, zoom });
        return;
      }

      try {
        apiClient.put(`/geofance/fetures/${id}`, {
          zoom,
          userid: userInfo.user_id,
        });
        console.log('Zoom updated:', zoom);
      } catch (error) {
        console.error('Error updating zoom:', error);
      }
    }, 500),
    [id, userInfo]
  );

  // Handle marker drag end
  const handleDragEnd = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      console.error('Invalid coordinates for drag end:', { lat, lng });
      return;
    }
    mainMapRef.current.setView([lat, lng], mainMapRef.current.getZoom());
    setMapCenter([lat, lng]);
  };

  // Handle centering the map
  const handleToCenter = () => {
    if (!mainMapRef.current || !Array.isArray(latlng)) {
      console.error('Cannot center map:', { map: mainMapRef.current, latlng });
      return;
    }
    mainMapRef.current.setView(latlng, mainMapRef.current.getZoom());
    markerRef.current.setLatLng(latlng);
    setMapCenter(latlng);
  };

  useEffect(() => {
    if (!mainMapRef.current || !markerRef.current) return;
    const map = mainMapRef.current;
    const marker = markerRef.current;

    const onMoveEnd = () => {
      const center = map.getCenter();
      const newPosition = [center.lat, center.lng];
      debouncedSavePosition(newPosition);
    };

    const onZoomEnd = () => {
      const newZoom = map.getZoom();
      debouncedSaveZoom(newZoom);
    };

    map.on("moveend", onMoveEnd);
    map.on("zoomend", onZoomEnd);

    return () => {
      map.off("moveend", onMoveEnd);
      map.off("zoomend", onZoomEnd);
    };
  }, [mapCenter]); // reactive kepada perubahan mapCenter

  useEffect(() => {
    setMapCenter(latlng);
  },[]);

  return {
    handleDragEnd,
    handleToCenter,
    mainMapRef,
    markerRef,
  };
};

export default useHandleMapEditor;
