const http = require("http");
const app = require("./app.js");
const wsHandler = require("./websocket/wsHandler.js");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app.callback());

wsHandler(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
