const messageService = require('../services/messageService.js');
const { broadcast } = require('../websocket/wsHandler.js');

module.exports = {
  async getMessages(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    
    const messages = messageService.getMessages(page, limit);
    ctx.body = { messages, page, limit };
  },

  async createMessage(ctx) {
    const { content, type = 'text' } = ctx.request.body;
    
    if (!content || content.trim() === '') {
      ctx.status = 400;
      ctx.body = { error: 'Content is required' };
      return;
    }

    const message = messageService.createMessage(content, type);
    
    broadcast({
      type: 'new_message',
      data: message,
    });
    
    ctx.status = 201;
    ctx.body = message;
  },
};