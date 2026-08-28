const store = require('../store/memoryStore.js');

class MessageService {
  createMessage(content, type = 'text') {
    if (!content || content.trim() === '') {
      throw new Error('Message content is required');
    }
    
    return store.addMessage({ 
      content: content.trim(), 
      type 
    });
  }

  getMessages(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return store.getMessages(limit, offset);
  }
}

module.exports = new MessageService();