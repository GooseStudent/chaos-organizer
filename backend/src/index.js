const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const http = require('http');
const WebSocket = require('ws');

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: '*',  
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser());

const messages = [];
let counter = 0;

router.get('/api/messages', async (ctx) => {
  const page = parseInt(ctx.query.page) || 1;
  const limit = parseInt(ctx.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const sorted = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  ctx.body = {
    messages: sorted.slice(start, end),
    page,
    limit
  };
});

router.post('/api/messages', async (ctx) => {
  const { content, type = 'text' } = ctx.request.body;
  
  if (!content || content.trim() === '') {
    ctx.status = 400;
    ctx.body = { error: 'Content is required' };
    return;
  }
  
  counter++;
  const message = {
    id: counter,
    content: content.trim(),
    type,
    timestamp: Date.now(),
    isPinned: false,
    isFavorite: false,
    links: (content.match(/(https?:\/\/[^\s]+)/g) || [])
  };
  
  messages.push(message);
  console.log('Message saved:', message);
  
  broadcast({
    type: 'new_message',
    data: message
  });
  
  ctx.status = 201;
  ctx.body = message;
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server, path: '/ws' });
const clients = new Set();

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      console.log('WebSocket message received:', parsed);
    } catch (error) {
      console.error('WebSocket parse error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('WebSocket running on ws://localhost:' + PORT + '/ws');
});