import { Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { matchTopicsGroup } from "../../utils/constants";
import { useMqtt } from "../../utils/useContexts";
import L from 'leaflet';
import car from "../../assets/car1.png";

function MapTrackers() {
  const { mqttData } = useMqtt()
  const [trackers, setTrackers] = useState([]);

  // delete L.Icon.Default.prototype._getIconUrl;
  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  // });

  // Custom car icon
  const carIcon = new L.Icon({
    iconUrl: car, // Use the imported car icon
    iconSize: [18, 41], // Maintain aspect ratio relative to 18px width
    iconAnchor: [9, 41], // Centered at the bottom
    popupAnchor: [0, -41], // Popup position relative to the icon
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", // Optional shadow
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
  });

  useEffect(() => {
    const topic = 'device/location/#'
    const subscribe = Object.entries(mqttData || {})
    setTrackers(matchTopicsGroup(subscribe, topic))
  }, [mqttData])

  //   {
  //     "location_lat": 5.3784106,
  //     "location_lon": 100.4648049,
  //     "speed": 14.0161,
  //     "accuracy": 6.454999923706055,
  //     "altitude": -1.100000023841858,
  //     "heading": 350.129638671875,
  //     "battery_level": 86,
  //     "timestamp": "2025-01-15T12:58:38.732175",
  //     "device_id": "RKQ1.201004.002",
  //     "network_type": "Mobile",
  //     "location_source": "GPS",
  //     "battery_status": "discharging"
  // }
  return trackers.map((trk, idx) => <Marker
    key={idx}
    position={[trk[1].location_lat, trk[1].location_lon]}
    icon={carIcon}>
    <Popup>
      <strong>Device ID:</strong> {trk[1].device_id}
      <br />
      <strong>Coordinates:</strong> {trk[1].location_lat}, {trk[1].location_lon}
      <br />
      <strong>Speed:</strong> {trk[1].speed ? `${trk[1].speed.toFixed(2)} km/h` : "N/A"}
      <br />
      <strong>Accuracy:</strong> {trk[1].accuracy ? `${trk[1].accuracy.toFixed(2)} m` : "N/A"}
      <br />
      <strong>Battery:</strong> {trk[1].battery_level ? `${trk[1].battery_level}%` : "N/A"}
      <br />
      <strong>Timestamp:</strong> {new Date(trk[1].timestamp).toLocaleString()}
    </Popup>
  </Marker>)
}

export default MapTrackers;
