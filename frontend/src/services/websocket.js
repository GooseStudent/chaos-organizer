const WS_URL =
  location.hostname === "localhost"
    ? "ws://localhost:3000/ws-chaos"
    : (location.protocol === "https:" ? "wss://" : "ws://") +
      location.host +
      "/ws-chaos";

export default class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((fn) => fn(data));
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.reconnect();
      };

      this.ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        this.ws.close();
      };
    } catch (err) {
      console.error("Failed to connect WebSocket:", err);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log("Reconnecting... Attempt " + this.reconnectAttempts);
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, message not sent");
    }
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  disconnect() {
    if (this.ws) this.ws.close();
  }
}
