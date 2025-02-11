import React from "react";
import NodeMarker from "./NodeMarker";
import { useMapContext } from "../../utils/useContexts";

const DevicesMarker = () => {
	const { markers } = useMapContext();

	return (markers?.map((marker, idx) => (<NodeMarker key={idx} marker={marker} accept="marker" />)));
};

export default React.memo(DevicesMarker);