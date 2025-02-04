import { Marker, Popup } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import { matchTopicsGroup } from "../../utils/components";
import { useMqtt } from "../../utils/useContexts";
import L from 'leaflet';
import car from "../../assets/car1.png";

function MapTrackers() {
  const { mqttData } = useMqtt()
  const [trackers, setTrackers] = useState([]);

  // Custom car icon
  const carIcon = useMemo(() => new L.Icon({
    iconUrl: car,
    iconSize: [18, 41],
    iconAnchor: [9, 41],
    popupAnchor: [0, -41],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
  }), []); // Memoize icon creation

  useEffect(() => {
    try {
      const topic = 'device/location/#'
      const subscribe = Object.entries(mqttData || {});
      const matchedTrackers = matchTopicsGroup(subscribe, topic);
      
      // Validate tracker data
      const validTrackers = matchedTrackers.filter(trk => {
        const data = trk[1];
        return (
          data &&
          typeof data.location_lat === 'number' &&
          typeof data.location_lon === 'number' &&
          !isNaN(data.location_lat) &&
          !isNaN(data.location_lon) &&
          Math.abs(data.location_lat) <= 90 &&
          Math.abs(data.location_lon) <= 180
        );
      });

      setTrackers(validTrackers);
    } catch (error) {
      console.error('Error processing tracker data:', error);
      setTrackers([]);
    }
  }, [mqttData]);

  return trackers.map((trk, idx) => {
    const data = trk[1];
    
    // Format values with fallbacks
    const formatValue = (value, decimals = 2) => {
      return typeof value === 'number' && !isNaN(value) 
        ? value.toFixed(decimals) 
        : "N/A";
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
      try {
        return new Date(timestamp).toLocaleString();
      } catch (error) {
        return "Invalid Date";
      }
    };

    return (
      <Marker
        key={`tracker-${data.device_id || idx}`}
        position={[data.location_lat, data.location_lon]}
        icon={carIcon}
      >
        <Popup>
          <strong>Device ID:</strong> {data.device_id || "Unknown"}
          <br />
          <strong>Coordinates:</strong> {data.location_lat}, {data.location_lon}
          <br />
          <strong>Speed:</strong> {formatValue(data.speed)} km/h
          <br />
          <strong>Accuracy:</strong> {formatValue(data.accuracy)} m
          <br />
          <strong>Battery:</strong> {formatValue(data.battery_level, 0)}%
          <br />
          <strong>Timestamp:</strong> {formatTimestamp(data.timestamp)}
          <br />
          <strong>Network:</strong> {data.network_type || "N/A"}
          <br />
          <strong>Source:</strong> {data.location_source || "N/A"}
        </Popup>
      </Marker>
    );
  });
}

export default MapTrackers;
