const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

const app = new Koa();
const router = new Router();

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
  console.log('📝 Saved:', message);
  
  ctx.status = 201;
  ctx.body = message;
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Messages: ${messages.length}`);
});

module.exports = app;