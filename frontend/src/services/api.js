const API_URL = "/api";

export default class ApiService {
  async getMessages(page = 1, limit = 10) {
    const res = await fetch(`${API_URL}/messages?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  }

  async sendMessage(content, type = "text") {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  }

  async uploadFile(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_URL}/messages/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Failed to upload file");
    return res.json();
  }

  async toggleFavorite(id) {
    const res = await fetch(`${API_URL}/messages/${id}/favorite`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");
    return res.json();
  }

  async getFavorites(page = 1, limit = 10) {
    const res = await fetch(`${API_URL}/favorites?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  }

  async getByType(type, page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/messages/type/${type}?page=${page}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to fetch by type");
    return res.json();
  }

  async search(query, page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/messages/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to search");
    return res.json();
  }
}
