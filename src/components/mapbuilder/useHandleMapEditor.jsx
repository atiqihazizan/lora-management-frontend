import { useEffect, useRef, useCallback, useState } from "react";
import { formatLatLong } from "../../utils/components";
import { useStateContext } from "../../utils/useContexts";
import apiClient from "../../utils/apiClient";
import debounce from "lodash.debounce";

const useHandleMapEditor = (id, latlng) => {
  const { userInfo } = useStateContext();
  const mainMapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([]);

  // Save map state with debounce
  const debouncedSaveMapState = useCallback(
    debounce((updates) => {
      if (!id || !userInfo?.user_id) {
        console.error('Invalid data for saving map state:', { id, userInfo, updates });
        return;
      }

      try {
        apiClient.put(`/maps/${id}`, {
          ...updates,
          userid: userInfo.user_id,
        });
        console.log('Map state updated:', updates);
      } catch (error) {
        console.error('Error updating map state:', error);
      }
    }, 500),
    [id, userInfo]
  );

  // Handle marker drag end
  const handleDragEnd = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') return;
    const newLatLng = [lat, lng];
    mainMapRef.current.setView(newLatLng, mainMapRef.current.getZoom());
    debouncedSaveMapState({ latlng: formatLatLong(newLatLng) });
  };

  // Handle centering the map
  const handleToCenter = () => {
    if (!mainMapRef.current || !Array.isArray(latlng)) return;
    debouncedSaveMapState({ latlng: formatLatLong(latlng) });
    markerRef.current.setLatLng(latlng);
    mainMapRef.current.setView(latlng, mainMapRef.current.getZoom());
  };

  // Handle zoom events
  const handleZoomEnd = useCallback(() => {
    if (!mainMapRef.current) return;
    const zoom = mainMapRef.current.getZoom();
    debouncedSaveMapState({ zoom });
  }, [debouncedSaveMapState]);

  useEffect(() => {
    const map = mainMapRef.current;
    if (!map) return;

    map.on("zoomend", handleZoomEnd);

    // Cleanup
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [mapCenter]); // Add map ref to dependencies

  useEffect(() => {
    setMapCenter(latlng);
  }, [latlng]);

  return {
    mainMapRef,
    markerRef,
    handleDragEnd,
    handleToCenter,
  };
};

export default useHandleMapEditor;
