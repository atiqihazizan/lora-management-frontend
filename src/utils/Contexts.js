import { createContext } from "react";
export const MapGuestContext = createContext();
export const MqttContext = createContext();
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
});
export const StateContext = createContext({
  login: () => console.warn("Authentication not implemented"),
  logout: () => console.warn("Authentication not implemented"),
  notify: () => console.warn("Notification not implemented"),
  userToken: null,
  userInfo: null,
  devices: [],
  tiles: [],
  handleFocus: () => { },
  setIsChangePasswordOpen: () => { },
});