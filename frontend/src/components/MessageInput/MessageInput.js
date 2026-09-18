export default class MessageInput {
  render(container) {
    container.innerHTML = `
      <div class="input-wrapper">
        <textarea 
          class="message-input" 
          placeholder="Введите сообщение..."
          rows="1"
        ></textarea>
        <button class="send-btn">➤</button>
      </div>
    `;
  }
}
