import React, { useEffect, useState, useMemo, useRef } from "react";
import { useMapGuestContext } from "../../utils/useContexts";
import { useMap } from "react-leaflet";
import MeshConnections from "../MeshConnections";
import BrokerClient from "../../utils/brokerClient";

function DeviceStatus() {
  const [meshConnections, setMeshConnections] = useState([]);
  const { markers, mapSelect } = useMapGuestContext();
  const map = useMap();
  const brokerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

 // Initialize broker on mount
 useEffect(() => {
	brokerRef.current = new BrokerClient();
	return () => {
		if (brokerRef.current) {
			brokerRef.current.disconnect();
		}
	};
}, []);

  // Get available nodes and group them by topic
  const { topics, nodesByTopic } = useMemo(() => {
    const allNodes = markers?.filter(m => m.type === 2 && m.mapid === mapSelect?.id) || [];
    const topics = [...new Set(allNodes.map(item => item.topic))];
    const nodesByTopic = topics.map(topic => 
      allNodes.filter(node => node.topic === topic)
    );
    return { topics, nodesByTopic };
  }, [markers, mapSelect]);

  useEffect(() => {
    if (!mapSelect?.id || !brokerRef.current) return;

    let isSubscribed = true;

    const handleMessage = (i, topic, message) => {
      if (!isSubscribed) return;
      
      try {
        if (!message) {
          console.error('Empty MQTT message received');
          return;
        }
        const mqttData = JSON.parse(message);
        
        setMeshConnections(prevConnections => {
          const newConnections = [...(prevConnections || [])];
          newConnections[i] = mqttData;
          return newConnections;
        });
      } catch (error) {
        console.error('Error processing MQTT message:', error);
        setMeshConnections([]);
      }
    };

    // Initialize meshConnections array with empty values for each topic
    setMeshConnections(new Array(topics.length).fill(null));


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

    // Connect and subscribe
    connectAndSubscribe();

    brokerRef.current.onConnect(() => {
      if (isSubscribed) {
        topics.forEach((topic, i) => {
          brokerRef.current.subscribe(topic, (t, m) => handleMessage(i, t, m));
        });
      }
    });

    // Cleanup function
    return () => {
      isSubscribed = false;
      brokerRef.current.disconnect();
      setIsConnected(false);
    };
  }, [mapSelect?.id, topics]); // Updated dependency to topics

  if (!mapSelect || nodesByTopic.length === 0) return null;

  return (
    meshConnections.map((mc, i) => mc && (
      <MeshConnections
        key={i}
        meshConnections={mc}
        markers={nodesByTopic[i]}
        map={map}
        lineOptions={{
          color: '#dc2626',
          weight: 3,
          dashArray: '5, 10',
          opacity: 0.7
        }}
      />
    ))
  );
};

export default DeviceStatus;