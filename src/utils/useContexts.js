import { useContext } from "react";
import { MapContext, StateContext } from "./Contexts";

export const useStateContext = ()=> useContext(StateContext)
export const useMapContext = ()=> useContext(MapContext)