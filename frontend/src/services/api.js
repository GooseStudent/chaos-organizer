const API_URL = 'https://chaos-organizer-2p5r.onrender.com/api';

export default class ApiService {
  async getMessages(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/messages?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      console.log('Messages loaded:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { messages: [] };
    }
  }

  async sendMessage(content, type = 'text') {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, type }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      console.log('📤 Message sent:', data);
      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }
}