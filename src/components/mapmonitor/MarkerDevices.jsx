import IconMarker from "../IconMarker";
import PropTypes from "prop-types";
import { Marker } from "react-leaflet";
import { useMqtt } from "../../context/MqttContext";
import { useMemo } from "react";
import { matchTopic } from "../../utils/constants";

const MarkerDevices = ({ data }) => {
  const { center, prop, topic, ...etc } = data;
  const { mqttData } = useMqtt();

  const matchedData = useMemo(() =>
    Object.entries(mqttData).find(([t]) => matchTopic(t, (topic || ''))),
    [mqttData, topic]
  );

  const filteredProps = useMemo(() =>
    Array.isArray(prop) && matchedData
      ? prop.map((p) => ({ ...p, val: matchedData[1][p.key] ?? p.val }))
      : prop,
    [prop, matchedData]
  );


  return <Marker position={center} icon={IconMarker({ ...etc, prop: filteredProps })} />;
};

MarkerDevices.propTypes = {
  data: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number).isRequired, // [lat, lng]
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
    topic: PropTypes.string, // MQTT topic to match
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Optional marker ID
  }).isRequired,
};

export default MarkerDevices;
