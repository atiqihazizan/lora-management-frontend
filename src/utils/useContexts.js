import { useContext } from "react";
import { MapContext, MqttContext, MapGuestContext, StateContext } from "./Contexts";

export const useStateContext = ()=> useContext(StateContext)
export const useMapContext = ()=> useContext(MapContext)
export const useMapGuestContext = ()=> useContext(MapGuestContext)
export const useMqtt = () => useContext(MqttContext);
