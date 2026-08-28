import Chat from './Chat/Chat.js';
import Sidebar from './Sidebar/Sidebar.js';
import ApiService from '../services/api.js';
import WebSocketService from '../services/websocket.js';

export default class App {
  constructor() {
    this.api = new ApiService();
    this.ws = new WebSocketService();
    this.chat = null;
    this.sidebar = null;
  }

  async init() {
    this.ws.connect();
    this.ws.onMessage((data) => {
      if (data.type === 'new_message') {
        this.chat.addMessage(data.data);
      }
    });

    this.sidebar = new Sidebar();
    this.chat = new Chat(this.api);

    this.render();

    await this.chat.loadMessages();
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-container">
        <aside class="sidebar"></aside>
        <main class="chat-main"></main>
      </div>
    `;

    this.sidebar.render(document.querySelector('.sidebar'));
    this.chat.render(document.querySelector('.chat-main'));
  }
}