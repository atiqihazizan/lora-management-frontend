import IconMarker from "../IconMarker";
import PropTypes from "prop-types";
import { Marker } from "react-leaflet";
import { useMemo } from "react";
import { matchTopic } from "../../utils/components";
import { useMqtt } from "../../utils/useContexts";

const MarkerDevices = ({ data }) => {
  const { center, prop, topic, ...etc } = data;
  const { mqttData } = useMqtt();

  // Safely match MQTT topic
  const matchedData = useMemo(() => {
    try {
      console.log(topic,mqttData['loramesh/ws/LSMC']);
      return Object.entries(mqttData).find(([t]) => matchTopic(t, (topic || '')));
    } catch (error) {
      console.error('Error matching MQTT topic:', error);
      return null;
    }
  }, [mqttData, topic]);

  // Get value from nested object using key path
  const getNestedValue = (obj, path) => {
    try {
      return path.split('.').reduce((curr, key) => curr?.[key], obj);
    } catch (error) {
      console.error('Error accessing nested value:', error);
      return '';
    }
  };

  // Safely process props with MQTT data
  const filteredProps = useMemo(() => {
    try {
      if (!Array.isArray(prop)) return [];
      
      return matchedData
        ? prop.map((p) => ({ 
            ...p, 
            val: String(getNestedValue(matchedData[1], p.key) || p.val || '') 
          }))
        : prop.map(p => ({
            ...p,
            val: String(p.val || '') // Ensure val is string
          }));
    } catch (error) {
      console.error('Error processing props:', error);
      return [];
    }
  }, [prop, matchedData]);

  // Validate center coordinates
  if (!center || !Array.isArray(center) || center.length !== 2 || 
      !center.every(c => typeof c === 'number' && !isNaN(c))) {
    console.error('Invalid center coordinates:', center);
    return null;
  }

  return (
    <>
      <Marker
        position={center}
        icon={IconMarker({ ...etc, prop: filteredProps })}
      />
      {/* <Marker position={center}/> */}
    </>
  );
};

MarkerDevices.propTypes = {
  data: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number).isRequired, // [lat, lng]
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    topic: PropTypes.string, // MQTT topic to match
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Optional marker ID
  }).isRequired,
};

export default MarkerDevices;
