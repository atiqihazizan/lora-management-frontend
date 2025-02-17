import IconMarker from "../IconMarker";
import PropTypes from "prop-types";
import { Marker } from "react-leaflet";
import { useEffect, useMemo, useState, useRef } from "react";
import BrokerClient from "../../utils/brokerClient";

const MarkerDevices = ({ data, topic }) => {
  const { center, prop, type, ...etc } = data;
  const [propMqtt, setPropMqtt] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use ref for broker to persist across re-renders
  const brokerRef = useRef(null);
  
  // Initialize broker on mount
  useEffect(() => {
    brokerRef.current = new BrokerClient();
    return () => {
      if (brokerRef.current) {
        brokerRef.current.disconnect();
      }
    };
  }, []);

  // Get value from nested object using key path
  const getNestedValue = (obj, path) => {
    try {
      return path.split('.').reduce((curr, key) => curr?.[key], obj);
    } catch (error) {
      console.error('Error accessing nested value:', error);
      return '';
    }
  };

  // Memoize MQTT message handler
  const handleMessage = useMemo(() => {
    return (_,message) => {
      const mqttData = JSON.parse(message);
      
      if (!Array.isArray(prop)) return [];

      try {
        const newProps = mqttData
          ? prop.map((p) => ({ 
              ...p, 
              val: String(getNestedValue(mqttData, p.key) || p.val || '') 
            }))
          : prop.map(p => ({
              ...p,
              val: String(p.val || '')
            }));
        setPropMqtt(newProps);
      } catch (error) {
        console.error('Error processing props:', error);
      }
    };
  }, [prop]);

  // Effect for MQTT connection
  useEffect(() => {
    if (type === 2 || !topic || !brokerRef.current) return;
    let isMounted = true;

    const connectAndSubscribe = async () => {
      try {
        if (!isConnected) {
          brokerRef.current.connect();
          setIsConnected(true);
        }

        brokerRef.current.onConnect(() => {
          if (isMounted) {
            brokerRef.current.subscribe(topic, handleMessage);
          }
        });
      } catch (error) {
        console.error('MQTT setup error:', error);
      }
    };

    connectAndSubscribe();

    return () => {
      isMounted = false;
      if (isConnected) {
        brokerRef.current.disconnect();
        setIsConnected(false);
      }
    };
  }, [topic, type, handleMessage, isConnected]);

  // Memoize marker icon
  const markerIcon = useMemo(() => {
    return IconMarker({
      ...etc,
      prop: propMqtt.length ? propMqtt : prop
    });
  }, [etc, prop, propMqtt]);

  // Validate center coordinates
  if (!center || !Array.isArray(center) || center.length !== 2 ||
    !center.every(c => typeof c === 'number' && !isNaN(c))) {
    console.error('Invalid center coordinates:', center);
    return null;
  }

  // Memoize marker component
  return useMemo(() => {
    return (
      <Marker
        position={center}
        icon={markerIcon}
      />
    );
  }, [center, markerIcon]);
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
