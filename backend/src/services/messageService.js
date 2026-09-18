const store = require("../store/memoryStore.js");

class MessageService {
  createMessage(content, type = "text") {
    if (!content || content.trim() === "") {
      throw new Error("Message content is required");
    }
    return store.addMessage({ content: content.trim(), type });
  }

  createFileMessage({ fileUrl, fileName, fileSize, type }) {
    return store.addMessage({
      content: fileName,
      type,
      fileUrl,
      fileName,
      fileSize,
    });
  }

  getMessages(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return store.getMessages(limit, offset);
  }

  getById(id) {
    return store.getById(id);
  }

  toggleFavorite(id) {
    return store.toggleFavorite(id);
  }

  getFavorites(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return store.getFavorites(limit, offset);
  }

  getByType(type, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return store.getByType(type, limit, offset);
  }

  search(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return store.search(query, limit, offset);
  }
}

module.exports = new MessageService();
