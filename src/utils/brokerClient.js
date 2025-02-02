import mqtt from "mqtt";
import { matchTopic } from "./constants";

class BrokerClient {
  constructor() {
    this.brokerUrl = "ws://178.128.48.114:8885";
    this.options = {
      keepalive: 60,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    };
    this.client = null;
    this.isReconnecting = false; // Flag to prevent multiple simultaneous reconnect attempts
    this.onConnectCallback = null; // Callback for onConnect event
    this.pendingSubscriptions = []; // Simpan topik yang belum dilanggan
  }

  // Connect to the broker
  connect() {
    if (!this.client) {
      this.client = mqtt.connect(this.brokerUrl, {
        ...this.options,
        reconnectPeriod: 5000, // Attempt to reconnect every 5 seconds
      });

      this.client.on("connect", () => {
        console.log("Real-Time is ready");
        this.isReconnecting = false; // Reset reconnect flag upon successful connection
        if (this.onConnectCallback) {
          this.onConnectCallback(); // Call the onConnect callback if set
        }

        // Langgan semua topik yang tertangguh
        this.pendingSubscriptions.forEach(({ topic, callback }) => {
          this.subscribe(topic, callback);
        });
        this.pendingSubscriptions = []; // Kosongkan senarai langganan tertangguh
      });

      this.client.on("error", (err) => {
        console.error("Connection error:", err);
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this.client.end();
          setTimeout(() => {
            this.connect(); // Retry connecting after error
          }, 5000);
        }
      });

      this.client.on("close", () => {
        console.log(
          "Disconnected from MQTT broker, attempting to reconnect..."
        );
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          setTimeout(() => {
            this.connect(); // Retry connecting
          }, 5000);
        }
      });

      this.client.on("reconnect", () => {
        console.log("Attempting to reconnect to MQTT broker...");
      });

      this.client.on("offline", () => {
        console.log("MQTT client is offline");
      });
    }
  }

  // Set a callback to be called on successful connection
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  // Subscribe to a topic
  subscribe(topic, callback) {
    if (this.client && this.client.connected) {
      // Check if client is connected
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic: ${topic}`, err);
        } else {
          // console.log(`Subscribed to topic: ${topic}`);
          // Set handler for the topic
          this.client.on("message", (receivedTopic, payload) => {
            if (matchTopic(receivedTopic, topic)) {
              callback(receivedTopic, payload.toString());
            }
          });
        }
      });
    } else {
      console.log("Client not connected. Adding to pending subscriptions.");
      // Simpan langganan dalam senarai tertangguh
      this.pendingSubscriptions.push({ topic, callback });
    }
  }

  // Publish a message to a topic
  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message, (err) => {
        if (err) {
          console.error(`Failed to publish message to topic: ${topic}`, err);
        } else {
          console.log(`Message published to topic: ${topic}`);
        }
      });
    } else {
      console.error("Client is not connected. Call connect() first.");
    }
  }

  // Disconnect the client
  disconnect() {
    if (this.client) {
      this.client.end(() => {
        console.log("Disconnected");
      });
    }
  }
}

export default BrokerClient;
