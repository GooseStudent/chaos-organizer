class MemoryStore {
  constructor() {
    this.messages = [];
    this.counter = 0;
  }

  addMessage(message) {
    this.counter++;
    const newMessage = {
      id: this.counter,
      content: message.content || '', 
      type: message.type || 'text',
      timestamp: Date.now(),
      isPinned: false,
      isFavorite: false,
      links: this.extractLinks(message.content || ''),
    };
    this.messages.push(newMessage);
    console.log('Message saved:', newMessage);
    return newMessage;
  }

  extractLinks(content) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.match(urlRegex) || [];
  }

  getMessages(limit = 10, offset = 0) {
    const sorted = [...this.messages].sort((a, b) => b.timestamp - a.timestamp);
    return sorted.slice(offset, offset + limit);
  }
}

module.exports = new MemoryStore();