const http = require('http');
const app = require('./app.js');
const wsHandler = require('./websocket/wsHandler.js');

const server = http.createServer(app.callback());

wsHandler(server);

module.exports = server;