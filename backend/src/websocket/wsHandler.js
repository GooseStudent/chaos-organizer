const WebSocket = require('ws');

let wss = null;
const clients = new Set();

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = (server) => {
  wss = new WebSocket.Server({ 
    server,
    path: '/ws' 
  });

  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.add(ws);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('WebSocket message received:', message);
        broadcast(message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return { broadcast };
};

module.exports.broadcast = broadcast;