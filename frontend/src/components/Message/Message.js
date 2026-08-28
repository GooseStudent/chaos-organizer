export default class Message {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.type = data.type || 'text';
    this.timestamp = data.timestamp || Date.now();
    this.isPinned = data.isPinned || false;
    this.isFavorite = data.isFavorite || false;
    this.links = data.links || [];
  }

  render() {
    const div = document.createElement('div');
    div.className = `message ${this.type}`;
    div.dataset.id = this.id;

    const time = new Date(this.timestamp).toLocaleTimeString();
    let contentHtml = this.content;

    if (this.links.length > 0) {
      this.links.forEach(link => {
        contentHtml = contentHtml.replace(
          link,
          `<a href="${link}" target="_blank" class="message-link">${link}</a>`
        );
      });
    }

    div.innerHTML = `
      <div class="message-content">${contentHtml}</div>
      <div class="message-footer">
        <span class="message-time">${time}</span>
        <div class="message-actions">
          ${this.isPinned ? '' : ''}
          ${this.isFavorite ? '' : ''}
          <button class="btn-pin" data-id="${this.id}"></button>
          <button class="btn-favorite" data-id="${this.id}"></button>
          <button class="btn-download"></button>
        </div>
      </div>
    `;

    div.querySelector('.btn-pin').addEventListener('click', () => {
    });
    div.querySelector('.btn-favorite').addEventListener('click', () => {
    });
    div.querySelector('.btn-download').addEventListener('click', () => {
    });

    return div;
  }
}