import { useContext } from "react";
import { MapContext, MqttContext, MapLayContext, StateContext } from "./Contexts";

export const useStateContext = ()=> useContext(StateContext)
export const useMapContext = ()=> useContext(MapContext)
export const useMapLayerContext = ()=> useContext(MapLayContext)
export const useMqtt = () => useContext(MqttContext);
