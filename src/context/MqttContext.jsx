import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import BrokerClient from "../utils/brokerClient";

const brokerClient = new BrokerClient("ws://178.128.48.114:8885", {
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 30000,
});

const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [mqttData, setMqttData] = useState({});

  useEffect(() => {
    try {
      brokerClient.connect();
      brokerClient.onConnect(() => {
        brokerClient.subscribe("#", (topic, message) => {
          if (message) {
            setMqttData((prevData) => ({ ...prevData, [topic]: JSON.parse(message) }));
            // } else {
            // throw new Error('Empty response from server');
          }
        });
      });
    } catch (error) {
      console.log(error);
    }

    return () => {
      // brokerClient.disconnect();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ mqttData }}>
      {children}
    </MqttContext.Provider>
  );
};

MqttProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMqtt = () => useContext(MqttContext);
