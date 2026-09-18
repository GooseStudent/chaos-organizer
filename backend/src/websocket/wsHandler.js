const WebSocket = require("ws");

const clients = new Set();

function broadcast(data) {
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

module.exports = (server) => {
  const wss = new WebSocket.Server({ server, path: "/ws-chaos" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
      console.log("WebSocket client disconnected");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      clients.delete(ws);
    });
  });
};

module.exports.broadcast = broadcast;
