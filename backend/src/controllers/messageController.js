const fs = require("fs");
const path = require("path");
const messageService = require("../services/messageService.js");
const { broadcast } = require("../websocket/wsHandler.js");

function detectType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "file";
}

module.exports = {
  async getMessages(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    const messages = messageService.getMessages(page, limit);
    ctx.body = { messages, page, limit };
  },

  async createMessage(ctx) {
    const { content, type = "text" } = ctx.request.body;

    if (!content || content.trim() === "") {
      ctx.status = 400;
      ctx.body = { error: "Content is required" };
      return;
    }

    const message = messageService.createMessage(content, type);
    broadcast({ type: "new_message", data: message });

    ctx.status = 201;
    ctx.body = message;
  },

  async downloadFile(ctx) {
    const message = messageService.getById(ctx.params.id);
    if (!message || !message.fileUrl) {
      ctx.status = 404;
      ctx.body = { error: "File not found" };
      return;
    }

    const fileName = path.basename(message.fileUrl);
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      fileName,
    );

    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: "File not found on disk" };
      return;
    }

    ctx.set(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(message.fileName || fileName)}`,
    );
    ctx.type = "application/octet-stream";
    ctx.body = fs.createReadStream(filePath);
  },

  async uploadFile(ctx) {
    const file = ctx.file;
    if (!file) {
      ctx.status = 400;
      ctx.body = { error: "File is required" };
      return;
    }

    console.log("UPLOAD:", {
      mimetype: file.mimetype,
      filename: file.filename,
      size: file.size,
    });

    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    const type = detectType(file.mimetype);
    const fileUrl = `/uploads/${file.filename}`;

    console.log("DETECTED TYPE:", type);

    const message = messageService.createFileMessage({
      fileUrl,
      fileName: originalName,
      fileSize: file.size,
      type,
    });

    broadcast({ type: "new_message", data: message });

    ctx.status = 201;
    ctx.body = message;
  },

  async toggleFavorite(ctx) {
    const message = messageService.toggleFavorite(ctx.params.id);
    if (!message) {
      ctx.status = 404;
      ctx.body = { error: "Message not found" };
      return;
    }

    broadcast({ type: "favorite_message", data: message });

    ctx.body = message;
  },

  async getFavorites(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    const messages = messageService.getFavorites(page, limit);
    ctx.body = { messages, page, limit };
  },

  async getByType(ctx) {
    const type = ctx.params.type;
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    const messages = messageService.getByType(type, page, limit);
    ctx.body = { messages, page, limit };
  },

  async search(ctx) {
    const q = ctx.query.q || "";
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    const messages = messageService.search(q, page, limit);
    ctx.body = { messages, page, limit, query: q };
  },
};
