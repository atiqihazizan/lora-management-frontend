import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import DialogDevice from "../src/components/DialogDevice";
import apiClient from "../src/utils/apiClient";
import { isObjectNotEmpty } from "../src/utils/constants";

 const MapContext = createContext({
  isDragging: false,
  setIsDragging: () => {},
  openMarkerDialog: () => {},
  markers: [],
  setMarkers: () => {},
  geoJsonData: [],
  setGeoJsonData: () => {},
  tileLayer: null,
  setTileLayer: () => {},
  setCurrentTileIndex: () => {},
  boundaryFlag: null,
  setBoundaryFlag: () => {},
});

export function MapProvider ({ defaultMarkers, defaultGeoJson, children }) {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  return (
    <MapContext.Provider
      value={{
        isDragging,
        setIsDragging,
        showDialog,
        setShowDialog,
        dialogData,
        setDialogData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapState = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapState mesti digunakan dalam MapProvider");
  }
  return context;
};

