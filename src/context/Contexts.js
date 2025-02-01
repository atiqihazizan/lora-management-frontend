import { createContext } from "react";

export const MapContext = createContext({
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
