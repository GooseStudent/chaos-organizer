import Chat from "./Chat/Chat.js";
import Sidebar from "./Sidebar/Sidebar.js";
import ApiService from "../services/api.js";
import WebSocketService from "../services/websocket.js";

export default class App {
  constructor() {
    this.api = new ApiService();
    this.ws = new WebSocketService();
    this.chat = null;
    this.sidebar = null;
  }

  async init() {
    this.sidebar = new Sidebar();
    this.chat = new Chat(this.api);

    this.render();

    await this.chat.loadMessages();

    this.ws.connect();
    this.ws.onMessage((data) => {
      if (data.type === "new_message")
        this.chat.addMessage(data.data, { scroll: true });
      else if (data.type === "favorite_message")
        this.chat.updateMessage(data.data);
    });
  }

  render() {
    const app = document.getElementById("app");
    const container = document.createElement("div");
    container.className = "app-container";

    const aside = document.createElement("aside");
    aside.className = "sidebar";

    const main = document.createElement("main");
    main.className = "chat-main";

    container.append(aside, main);
    app.replaceChildren(container);

    aside.addEventListener("filter-change", (e) => {
      this.chat.setFilter(e.detail.filter);
    });

    this.sidebar.render(aside);
    this.chat.render(main);
  }
}
