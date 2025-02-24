import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapContext, MapGuestContext } from "../utils/Contexts";
import PropTypes from "prop-types";
import apiClient from "../utils/apiClient";
import DialogDevice from "../components/DialogDevice";
import { formatLatLonToArray, isObjectNotEmpty, latlngToString } from "../utils/components";

const MapProvider = ({
  defaultMarkers,
  defaultGeoJson,
  children,
}) => {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [onClosing, setOnClosing] = useState(null);
  const [tileLayer, setTileLayer] = useState(null);
  const [currentTileIndex, setCurrentTileIndex] = useState(0);
  const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [mapSelect, setMapSelect] = useState(null);
  const [boundaries, setBoundaries] = useState([]);

  const openMarkerDialog = (markerData, onClosed) => {
    try {
      const newProp = typeof markerData?.prop === 'string' 
        ? JSON.parse(markerData.prop || "[]")
        : (markerData?.prop || []);

      // Format marker data
      const newDataMarker = { 
        ...markerData, 
        prop: newProp.map(p => ({
          ...p,
          val: (p.val ?? '').toString() 
        })),
        latlng: Array.isArray(markerData?.latlng) 
          ? markerData.latlng.join(',') 
          : markerData?.latlng || ""
      };

      setEditMode(newDataMarker.id !== undefined);
      setDialogData(newDataMarker);
      setShowDialog(true);
      if (onClosed) setOnClosing(() => onClosed);
    } catch (error) {
      console.error("Error preparing marker data:", error);
      // Handle error appropriately
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const method = editMode ? "put" : "post";
        const url = editMode ? `/nodes/${dialogData.id}` : "/nodes";

        // Format data for API
        const apiData = {
          name: data.name,
          type: data.type,
          topic: data.topic,
          mapid: data.mapid,
          unixid: data.unixid,
          latlng: latlngToString(data.latlng),
          icon:data.icon,
          prop: typeof data.prop === 'string' ? data.prop : JSON.stringify(data.prop)
        };
        
        const result = await apiClient[method](url, apiData);
        return { result, data: apiData };
      } catch (error) {
        console.error("Error saving marker:", error);
        throw error;
      }
    },
    onSuccess: ({ result, data }) => {
      try {
        const newData = {
          ...data,
          id: editMode ? data.id : result.newId,
          prop: typeof data.prop === 'string' ? JSON.parse(data.prop) : data.prop,
          latlng: Array.isArray(data.latlng) ? data.latlng : formatLatLonToArray(data.latlng)
        };
        
        // Update markers state
        if (editMode) {
          setMarkers((prevMarkers) =>
            prevMarkers.map((marker) =>
              marker.id === newData.id ? newData : marker
            )
          );
        } else {
          setMarkers((prevMarkers) => [...prevMarkers, newData]);
        }

        // Invalidate queries and close dialog
        queryClient.invalidateQueries(["mapview", dialogData.mapid]);
        handleDialogClose();
        return newData;
      } catch (error) {
        console.error("Error processing save result:", error);
        throw error;
      }
    },
  });

  const handleDialogSave = async (pendingData) => {
    try {
      await saveMutation.mutateAsync(pendingData);
    } catch (error) {
      console.error("Error in handleDialogSave:", error);
      // Handle error appropriately
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setDialogData(null);
    setIsDragging(false);
    if (onClosing) onClosing();
  };

  const handleDialogDelete = async (data) => {
    try {
      setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== data.id));
      await apiClient.delete(`/nodes/${data.id}`);
      queryClient.invalidateQueries(["mapview", dialogData.mapid]);
      handleDialogClose();
    } catch (error) {
      console.error("Failed to delete marker:", error);
    }
  };

  // Update markers state jika ada perubahan defaultMarkers
  useEffect(() => {
    if (defaultMarkers.length > 0) setMarkers(defaultMarkers);
    if (isObjectNotEmpty(defaultGeoJson)) setGeoJsonData(defaultGeoJson);
  }, [defaultMarkers, defaultGeoJson]);

  return (
    <MapContext.Provider
      value={{
        isDragging,
        setIsDragging,
        openMarkerDialog,
        markers,
        setMarkers,
        geoJsonData,
        setGeoJsonData,
        tileLayer,
        setTileLayer,
        currentTileIndex,
        setCurrentTileIndex,
      }}
    >
      <MapGuestContext.Provider
        value={{
          mapSelect,
          setMapSelect,
          boundaries,
          setBoundaries
        }}
      >
        {children}
        {showDialog && (
          <DialogDevice
            mode='map'
            isOpen={showDialog}
            onClose={handleDialogClose}
            onSave={handleDialogSave}
            initialData={dialogData}
            onDelete={handleDialogDelete}
          />
        )}
      </MapGuestContext.Provider>
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultMarkers: PropTypes.array,
  defaultGeoJson: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default MapProvider;
