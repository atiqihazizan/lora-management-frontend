import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import DialogDevice from "../src/components/DialogDevice";
import apiClient from "../src/utils/apiClient";
import { isObjectNotEmpty } from "../src/utils/constants";

const MapContext = createContext({
  isDragging: false,
  setIsDragging: () => { },
  openMarkerDialog: () => { },
  markers: [],
  setMarkers: () => { },
  geoJsonData: [],
  setGeoJsonData: () => { },
  tileLayer: null,
  setTileLayer: () => { },
  setCurrentTileIndex: () => { },
  boundaryFlag: null,
  setBoundaryFlag: () => { },
});

export const useMapState = () => useContext(MapContext);

const MapProvider = ({ defaultMarkers, defaultGeoJson, children }) => {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState({ type: "FeatureCollection", features: [] });
  const [editMode, setEditMode] = useState(false)
  const [onClosing, setOnClosing] = useState(null);
  const [tileLayer, setTileLayer] = useState(null);
  const [currentTileIndex, setCurrentTileIndex] = useState(0);
  const [boundaryFlag, setBoundaryFlag] = useState(false)

  const openMarkerDialog = (markerData, onClosed) => {
    const newProp = (() => {
      try {
        return JSON.parse(markerData?.prop || '[]');
      } catch (error) {
        console.error("Failed to parse prop data:", error);
        return [];
      }
    })();
    const newDataMarker = { ...markerData, prop: newProp };
    setEditMode(newDataMarker.id !== undefined)
    setDialogData(newDataMarker);
    setShowDialog(true);
    if (onClosed) setOnClosing(() => onClosed);
    // setIsDragging(false);
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const method = editMode ? "put" : "post";
      const url = editMode ? `/nodes/${dialogData.id}` : "/nodes";
      const result = await apiClient[method](url, data);
      return { result, data: data };
    },
    onSuccess: ({ result, data }) => {
      const newData = { ...data, prop: JSON.parse(data.prop) }
      if (editMode) {
        setMarkers((prevMarkers) => prevMarkers.map((marker) => marker.id === newData.id ? newData : marker))
      } else {
        data.id = result.newId
        setMarkers((prevMarkers) => [...prevMarkers, data]);
      }
      queryClient.invalidateQueries(['mapview', dialogData.mapid]);
      // queryClient.removeQueries(['mapview', dialogData.mapid]);
      handleDialogClose()
      // notify("error", "Login failed. Please check your credentials.");
      return data
    },
  });

  const handleDialogSave = async (pendingData) => {
    const reqData = { ...pendingData, prop: JSON.stringify(pendingData.prop) }
    saveMutation.mutateAsync(reqData);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setDialogData(null);
    setIsDragging(false);
    if (onClosing) onClosing()
  }

  // Update markers state jika ada perubahan defaultMarkers
  useEffect(() => {
    if (defaultMarkers.length > 0) setMarkers(defaultMarkers)
    if (isObjectNotEmpty(defaultGeoJson)) setGeoJsonData(defaultGeoJson)
  }, [defaultMarkers, defaultGeoJson])

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
        tileLayer, setTileLayer,
        currentTileIndex, setCurrentTileIndex,
        boundaryFlag, setBoundaryFlag,
      }}
    >
      {children}
      {showDialog && (
        <DialogDevice
          isOpen={showDialog}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
          initialData={dialogData}
        />
      )}
    </MapContext.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultMarkers: PropTypes.array,
  defaultGeoJson: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default MapProvider;