import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BrokerClient from "../utils/brokerClient";
import { MqttContext } from "../utils/Contexts";

const brokerClient = new BrokerClient();

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

