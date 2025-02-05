import { useEffect, useRef, useState } from "react";
import { formatLatLong } from "../../utils/components";
import apiClient from "../../utils/apiClient";
import { useStateContext } from "../../utils/useContexts";

const useHandleMapEditor = (id, latlng) => {
  const { userInfo } = useStateContext();
  const mainMapRef = useRef(null);
  const markerRef = useRef(null);
  const [isChange, setIsChange] = useState(false);

  // Save boundary position
  const onSavePosition = async (newLatLng) => {
    if (!id || !userInfo?.user_id || !Array.isArray(newLatLng)) {
      console.error('Invalid data for saving position:', { id, userInfo, newLatLng });
      return;
    }

    try {
      const formattedLatLng = formatLatLong(newLatLng);
      const res = await apiClient.put(`/boundaries/fetures/${id}`, {
        latlng: formattedLatLng,
        userid: userInfo.user_id,
      });
      mainMapRef.current.setView(newLatLng, 15);
      // setIsChange(newLatLng);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  // Save boundary zoom level
  const onSaveZoom = async (zoom) => {
    if (!id || !userInfo?.user_id || typeof zoom !== 'number') {
      console.error('Invalid data for saving zoom:', { id, userInfo, zoom });
      return;
    }

    try {
      await apiClient.put(`/boundaries/fetures/${id}`, {
        zoom,
        userid: userInfo.user_id,
      });
      console.log('Zoom updated:', zoom);
    } catch (error) {
      console.error('Error updating zoom:', error);
    }
  };

  // Handle marker drag end
  const handleDragEnd = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      console.error('Invalid coordinates for drag end:', { lat, lng });
      return;
    }
    onSavePosition([lat, lng]);
  };

  // Handle centering the map
  const handleToCenter = () => {
    if (!mainMapRef.current || !Array.isArray(latlng)) {
      console.error('Cannot center map:', { map: mainMapRef.current, latlng });
      return;
    }
    mainMapRef.current.setView(latlng, mainMapRef.current.getZoom());
    
    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    }
    // onSaveZoom(15);
  };

  // Update map when position changes
  useEffect(() => {
    if (isChange && Array.isArray(isChange)) {
      handleToCenter();
    }
  }, [isChange]);

  return {
    handleDragEnd,
    handleToCenter,
    mainMapRef,
    markerRef,
  };
};

export default useHandleMapEditor;
