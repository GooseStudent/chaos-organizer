class MemoryStore {
  constructor() {
    this.messages = [];
    this.counter = 0;
  }

  addMessage(message) {
    this.counter++;
    const newMessage = {
      id: this.counter,
      content: message.content || "",
      type: message.type || "text",
      timestamp: Date.now(),
      isPinned: false,
      isFavorite: false,
      links: this.extractLinks(message.content || ""),
      fileUrl: message.fileUrl || null,
      fileName: message.fileName || null,
      fileSize: message.fileSize || null,
    };
    this.messages.push(newMessage);
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

  getById(id) {
    return this.messages.find((m) => m.id === Number(id)) || null;
  }

  toggleFavorite(id) {
    const msg = this.messages.find((m) => m.id === Number(id));
    if (!msg) return null;
    msg.isFavorite = !msg.isFavorite;
    return msg;
  }

  getFavorites(limit = 10, offset = 0) {
    const favs = this.messages
      .filter((m) => m.isFavorite)
      .sort((a, b) => b.timestamp - a.timestamp);
    return favs.slice(offset, offset + limit);
  }

  getById(id) {
    return this.messages.find((m) => m.id === Number(id)) || null;
  }

  getByType(type, limit = 10, offset = 0) {
    const list = this.messages
      .filter((m) => m.type === type)
      .sort((a, b) => b.timestamp - a.timestamp);
    return list.slice(offset, offset + limit);
  }

  search(query, limit = 10, offset = 0) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const found = this.messages
      .filter((m) => {
        const inContent = (m.content || "").toLowerCase().includes(q);
        const inFileName = (m.fileName || "").toLowerCase().includes(q);
        return inContent || inFileName;
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return found.slice(offset, offset + limit);
  }
}

module.exports = new MemoryStore();
