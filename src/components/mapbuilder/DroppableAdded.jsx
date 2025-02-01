import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { useMapEvents } from "react-leaflet";
import { formatLatLong } from "../../utils/constants";
import PropTypes from "prop-types";
import { MapContext } from "../../context/Contexts";

const DroppableAdded = ({ accept, mapid }) => {
  // const geoJsonRef = useRef();
  const { isDragging, openMarkerDialog } = useContext(MapContext); // Gunakan openMarkerDialog

  const map = useMapEvents({
    load: () => console.log("Map loaded!"),
  });

  const [, dropRef] = useDrop({
    accept: accept,
    drop: async (item, monitor) => {
      if (!map) return console.error("Map not initialized!");
      const { x, y } = monitor.getClientOffset();
      const { left, top } = map.getContainer().getBoundingClientRect();
      const latLng = map.containerPointToLatLng([x - left, y - top]);

      const newMarkerData = {
        name: item.name,
        mapid: mapid,
        unixid: uuidv4(),
        latlng: formatLatLong([latLng.lat, latLng.lng].join(",")),
        icon: item.icon,
        prop: item.prop || '[]',
      };

      openMarkerDialog(newMarkerData);
    },
  });

  return (
    <>
      {isDragging && (<div ref={dropRef} className="marker-droppable-area absolute inset-0"></div>)}
      {/* {isObjectNotEmpty(geoJsonData) && (<GeoJSON data={geoJsonData} ref={geoJsonRef} />)} */}
    </>
  );
};

DroppableAdded.propTypes = {
  accept: PropTypes.string.isRequired,
  mapid: PropTypes.string.isRequired,
};

export default DroppableAdded;
