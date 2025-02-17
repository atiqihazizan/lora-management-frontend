import mqtt from "mqtt";
import { matchTopic } from "./components.js";

class BrokerClient {
  constructor() {
    this.brokerUrl = window._env_.MQTT_URL;
    this.options = {
      keepalive: 60,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      // username: 'lora2u_admin',
      // password: 'lora2u@2024',
      clean: true,
      rejectUnauthorized: false,
      protocolVersion: 4,
      clientId: `lora2u_${Math.random().toString(16).substring(2, 10)}`
    };
    this.client = null;
    this.isReconnecting = false;
    this.onConnectCallback = null;
    this.pendingSubscriptions = [];
    this.messageHandlers = new Map();
  }

  connect() {
    if (this.client?.connected) return;
    
    if (!this.client) {
      this.client = mqtt.connect(this.brokerUrl, this.options);

      this.client.on("connect", () => {
        this.isReconnecting = false;
        
        if (this.onConnectCallback) {
          this.onConnectCallback();
        }

        // Subscribe to pending topics
        this.pendingSubscriptions.forEach(({ topic, callback }) => {
          this.subscribe(topic, callback);
        });
        this.pendingSubscriptions = [];
      });

      this.client.on("message", (topic, payload) => {
        const handlers = this.messageHandlers.get(topic) || [];
        handlers.forEach(callback => {
          try {
            callback(topic, payload.toString());
          } catch (error) {
            console.error(`Error in message handler for topic ${topic}:`, error);
          }
        });
      });

      this.client.on("error", (err) => {
        console.error("Connection error:", err);
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          this.client.end();
          setTimeout(() => this.connect(), 5000);
        }
      });

      this.client.on("close", () => {
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          setTimeout(() => this.connect(), 5000);
        }
      });
    }
  }

  onConnect(callback) {
    this.onConnectCallback = callback;
    // console.log("Broker is ready");
    if (this.client?.connected) {
      callback();
    }
  }

  subscribe(topic, callback) {
    if (!this.client) {
      this.pendingSubscriptions.push({ topic, callback });
      return;
    }

    if (!this.client.connected) {
      this.pendingSubscriptions.push({ topic, callback });
      return;
    }

    // Add to message handlers
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, []);
    }
    this.messageHandlers.get(topic).push(callback);

    // Subscribe if not already subscribed
    if (!this.client.subscriptions?.[topic]) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic: ${topic}`, err);
          return;
        }
        console.log(`Subscribed to topic: ${topic}`);
      });
    }
  }

  publish(topic, message) {
    if (!this.client?.connected) {
      console.error("Cannot publish: client not connected");
      return;
    }
    this.client.publish(topic, message);
  }

  disconnect() {
    if (this.client) {
      this.messageHandlers.clear();
      this.pendingSubscriptions = [];
      this.client.end();
      this.client = null;
      // console.log("Disconnected from broker");
    }
  }
}

export default BrokerClient;
