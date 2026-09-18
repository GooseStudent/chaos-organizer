import Message from "../Message/Message.js";

export default class Chat {
  constructor(api) {
    this.api = api;
    this.page = 1;
    this.loading = false;
    this.allLoaded = false;
    this.filter = "all";
    this.searchQuery = "";
    this.container = null;
    this.messagesContainer = null;
  }

  render(container) {
    this.container = container;
    this.container.replaceChildren(this.#buildLayout());

    this.messagesContainer = this.container.querySelector(".chat-messages");
    this.messageInput = this.container.querySelector(".message-input");
    this.sendBtn = this.container.querySelector(".send-btn");
    this.fileUploadBtn = this.container.querySelector(".file-upload-btn");
    this.searchBtn = this.container.querySelector(".btn-search");
    this.searchBar = this.container.querySelector(".search-bar");
    this.searchInput = this.container.querySelector(".search-input");
    this.searchClose = this.container.querySelector(".search-close");

    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });

    this.sendBtn.addEventListener("click", () => this.sendMessage());

    this.messagesContainer.addEventListener("scroll", () =>
      this.handleScroll(),
    );

    this.messagesContainer.addEventListener("toggle-favorite", (e) => {
      this.#toggleFavorite(e.detail.id);
    });

    this.fileUploadBtn.addEventListener("click", () => this.#pickFiles());

    this.messagesContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.messagesContainer.classList.add("drag-over");
    });
    this.messagesContainer.addEventListener("dragleave", () => {
      this.messagesContainer.classList.remove("drag-over");
    });
    this.messagesContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      this.messagesContainer.classList.remove("drag-over");
      this.#uploadFiles(e.dataTransfer.files);
    });

    this.searchBtn.addEventListener("click", () => this.#toggleSearch());
    this.searchClose.addEventListener("click", () => this.#closeSearch());
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.#runSearch();
      if (e.key === "Escape") this.#closeSearch();
    });
  }

  #buildLayout() {
    const frag = document.createDocumentFragment();

    const header = document.createElement("div");
    header.className = "chat-header";

    const title = document.createElement("h2");
    title.textContent = "Chaos Organizer";

    const searchBtn = document.createElement("button");
    searchBtn.className = "btn-search";
    searchBtn.type = "button";
    searchBtn.title = "Поиск";

    const searchIcon = document.createElement("img");
    searchIcon.src = "/icons/search.png";
    searchIcon.alt = "Поиск";
    searchIcon.className = "btn-search-icon";

    searchBtn.append(searchIcon);
    header.append(title, searchBtn);

    const searchBar = document.createElement("div");
    searchBar.className = "search-bar";
    searchBar.hidden = true;

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "search-input";
    searchInput.placeholder = "Поиск";

    const searchClose = document.createElement("button");
    searchClose.className = "search-close";
    searchClose.type = "button";
    searchClose.textContent = "✕";

    searchBar.append(searchInput, searchClose);

    const messages = document.createElement("div");
    messages.className = "chat-messages";

    const inputContainer = document.createElement("div");
    inputContainer.className = "chat-input-container";

    const fileBtn = document.createElement("div");
    fileBtn.className = "file-upload-btn";
    fileBtn.textContent = "+";

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "message-input-wrapper";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "message-input";
    input.placeholder = "Наберите сообщение...";

    const sendBtn = document.createElement("button");
    sendBtn.className = "send-btn";
    sendBtn.type = "button";
    sendBtn.title = "Отправить";

    const sendIcon = document.createElement("img");
    sendIcon.src = "/icons/send.png";
    sendIcon.alt = "Отправить";
    sendIcon.className = "send-icon";

    sendBtn.append(sendIcon);

    inputWrapper.append(input, sendBtn);
    inputContainer.append(fileBtn, inputWrapper);

    frag.append(header, searchBar, messages, inputContainer);
    return frag;
  }

  async loadMessages() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data = await this.api.getMessages(this.page);

      if (data.messages.length === 0) {
        this.allLoaded = true;
        if (this.page === 1) this.#showEmpty("Сообщений нет");
        return;
      }

      const oldHeight = this.messagesContainer.scrollHeight;

      const frag = document.createDocumentFragment();
      for (const msg of data.messages) {
        frag.prepend(new Message(msg).render());
      }
      this.messagesContainer.prepend(frag);

      const newHeight = this.messagesContainer.scrollHeight;
      this.messagesContainer.scrollTop = newHeight - oldHeight;

      this.page++;
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      this.loading = false;
    }
  }

  async loadFavorites() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data = await this.api.getFavorites(this.page);

      if (data.messages.length === 0) {
        this.allLoaded = true;
        if (this.page === 1) this.#showEmpty("В избранном пусто");
        return;
      }

      const oldHeight = this.messagesContainer.scrollHeight;

      const frag = document.createDocumentFragment();
      for (const msg of data.messages) {
        frag.prepend(new Message(msg).render());
      }
      this.messagesContainer.prepend(frag);

      const newHeight = this.messagesContainer.scrollHeight;
      this.messagesContainer.scrollTop = newHeight - oldHeight;

      this.page++;
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      this.loading = false;
    }
  }

  async loadByType() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data = await this.api.getByType(this.filter, this.page);

      if (data.messages.length === 0) {
        this.allLoaded = true;
        if (this.page === 1) this.#showEmpty("Ничего не найдено");
        return;
      }

      const oldHeight = this.messagesContainer.scrollHeight;

      const frag = document.createDocumentFragment();
      for (const msg of data.messages) {
        frag.prepend(new Message(msg).render());
      }
      this.messagesContainer.prepend(frag);

      const newHeight = this.messagesContainer.scrollHeight;
      this.messagesContainer.scrollTop = newHeight - oldHeight;

      this.page++;
    } catch (err) {
      console.error("Failed to load by type:", err);
    } finally {
      this.loading = false;
    }
  }

  async sendMessage() {
    const text = this.messageInput.value.trim();
    if (!text) return;

    this.messageInput.value = "";

    try {
      await this.api.sendMessage(text);
    } catch (err) {
      console.error("Failed to send:", err);
      alert("Не удалось отправить сообщение");
    }
  }

  addMessage(message, { scroll = false } = {}) {
    if (this.filter === "favorites" || this.filter === "search") return;
    if (this.filter !== "all" && this.filter !== message.type) return;

    const existing = this.messagesContainer.querySelector(
      `.message[data-id="${message.id}"]`,
    );
    if (existing) return;

    const placeholder =
      this.messagesContainer.querySelector(".empty-placeholder");
    if (placeholder) placeholder.remove();

    if (this.allLoaded) this.allLoaded = false;

    const el = new Message(message).render();
    this.messagesContainer.append(el);

    if (scroll) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  updateMessage(message) {
    const el = this.messagesContainer.querySelector(
      `.message[data-id="${message.id}"]`,
    );

    if (this.filter === "favorites") {
      if (message.isFavorite) {
        if (el) {
          el.replaceWith(new Message(message).render());
        } else {
          this.messagesContainer.prepend(new Message(message).render());
        }
      } else {
        if (el) el.remove();
      }
      return;
    }

    if (!el) return;
    el.replaceWith(new Message(message).render());
  }

  async setFilter(filter) {
    this.filter = filter;
    this.page = 1;
    this.allLoaded = false;
    this.loading = false;
    this.messagesContainer.replaceChildren();

    if (filter === "favorites") await this.loadFavorites();
    else if (filter === "all") await this.loadMessages();
    else if (filter === "search") await this.#loadSearch();
    else await this.loadByType();
  }

  handleScroll() {
    if (this.messagesContainer.scrollTop === 0) {
      if (this.filter === "favorites") this.loadFavorites();
      else if (this.filter === "all") this.loadMessages();
      else if (this.filter === "search") this.#loadSearch();
      else this.loadByType();
    }
  }

  async #toggleFavorite(id) {
    try {
      await this.api.toggleFavorite(id);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  }

  async #uploadFiles(fileList) {
    const files = Array.from(fileList || []);
    for (const file of files) {
      try {
        await this.api.uploadFile(file);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Не удалось загрузить файл: " + file.name);
      }
    }
  }

  #pickFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", () => this.#uploadFiles(input.files));
    input.click();
  }

  #toggleSearch() {
    this.searchBar.hidden = !this.searchBar.hidden;
    if (!this.searchBar.hidden) this.searchInput.focus();
  }

  #closeSearch() {
    this.searchBar.hidden = true;
    this.searchInput.value = "";
    this.searchQuery = "";
    this.setFilter("all");
  }

  async #runSearch() {
    const q = this.searchInput.value.trim();
    this.searchQuery = q;

    this.page = 1;
    this.allLoaded = false;
    this.loading = false;
    this.filter = "search";
    this.messagesContainer.replaceChildren();

    if (!q) {
      this.setFilter("all");
      return;
    }

    await this.#loadSearch();
  }

  async #loadSearch() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data = await this.api.search(this.searchQuery, this.page);

      if (data.messages.length === 0) {
        this.allLoaded = true;
        if (this.page === 1) this.#showEmpty("Ничего не найдено");
        return;
      }

      const oldHeight = this.messagesContainer.scrollHeight;

      const frag = document.createDocumentFragment();
      for (const msg of data.messages) {
        frag.prepend(new Message(msg).render());
      }
      this.messagesContainer.prepend(frag);

      const newHeight = this.messagesContainer.scrollHeight;
      this.messagesContainer.scrollTop = newHeight - oldHeight;

      this.page++;
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      this.loading = false;
    }
  }

  #showEmpty(text = "Сообщений нет") {
    const empty = document.createElement("div");
    empty.className = "empty-placeholder";
    empty.style.cssText = "text-align:center;color:#999;padding:40px;";
    empty.textContent = text;
    this.messagesContainer.replaceChildren(empty);
  }
}
