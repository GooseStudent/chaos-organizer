import Message from '../Message/Message.js';

export default class Chat {
  constructor(api) {
    this.api = api;
    this.messages = [];
    this.page = 1;
    this.loading = false;
    this.allLoaded = false;
    this.container = null;
    this.messagesContainer = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="chat-header">
        <h2>Chaos Organizer</h2>
        <div class="chat-actions">
          <button class="btn-favorites">Избранное</button>
          <button class="btn-search">Поиск</button>
        </div>
      </div>
      <div class="chat-messages" id="messages-container">
        <div style="text-align:center;color:#999;padding:40px;">
          Загрузка сообщений...
        </div>
      </div>
      <div class="chat-input-container">
        <div class="file-upload-btn">+</div>
        <div class="message-input-wrapper">
          <input type="text" class="message-input" placeholder="Наберите сообщение..." />
          <button class="send-btn">
            <img src="/icons/send.png" alt="send" class="send-icon" />
          </button>
        </div>
      </div>
    `;

    this.messagesContainer = document.getElementById('messages-container');
    this.messageInput = this.container.querySelector('.message-input');
    this.sendBtn = this.container.querySelector('.send-btn');
    this.fileUploadBtn = this.container.querySelector('.file-upload-btn');

    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.messagesContainer.addEventListener('scroll', () => this.handleScroll());
  }

  async loadMessages() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data = await this.api.getMessages(this.page);
      if (data.messages.length === 0) {
        this.allLoaded = true;
        if (this.page === 1) {
          this.messagesContainer.innerHTML = `
            <div style="text-align:center;color:#999;padding:40px;">
              Сообщений нет<br>
              <small>Напишите первым!</small>
            </div>
          `;
        }
        return;
      }

      if (this.page === 1) {
        this.messagesContainer.innerHTML = '';
      }

      const oldHeight = this.messagesContainer.scrollHeight;
      data.messages.forEach(msg => {
        this.messages.unshift(msg);
        const messageEl = new Message(msg).render();
        this.messagesContainer.prepend(messageEl);
      });
      
      const newHeight = this.messagesContainer.scrollHeight;
      this.messagesContainer.scrollTop = newHeight - oldHeight;
      
      this.page++;
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.messagesContainer.innerHTML = `
        <div style="text-align:center;color:red;padding:20px;">
          Error loading messages<br>
          <small>${error.message}</small>
        </div>
      `;
    } finally {
      this.loading = false;
    }
  }

  async sendMessage() {
    const text = this.messageInput.value.trim();
    if (!text) return;

    this.messageInput.value = '';
    
    try {
      const message = await this.api.sendMessage(text);
      this.addMessage(message);
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send message');
    }
  }

  addMessage(message) {
    const placeholder = this.messagesContainer.querySelector('div[style]');
    if (placeholder && this.messagesContainer.children.length === 1) {
      this.messagesContainer.innerHTML = '';
    }

    this.messages.push(message);
    const messageEl = new Message(message).render();
    this.messagesContainer.Child(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  handleScroll() {
    if (this.messagesContainer.scrollTop === 0) {
      this.loadMessages();
    }
  }
}