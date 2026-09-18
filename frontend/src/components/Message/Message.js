import { linkify } from "../../utils/linkify.js";

export default class Message {
  constructor(data) {
    Object.assign(this, {
      id: data.id,
      content: data.content,
      type: data.type || "text",
      timestamp: data.timestamp || Date.now(),
      links: data.links || [],
      fileUrl: data.fileUrl || null,
      fileName: data.fileName || null,
      fileSize: data.fileSize || null,
      isFavorite: data.isFavorite || false,
      isPinned: data.isPinned || false,
    });
  }

  render() {
    const root = document.createElement("div");
    root.className = `message ${this.type}`;
    root.dataset.id = this.id;
    if (this.isFavorite) root.classList.add("is-favorite");

    const content = document.createElement("div");
    content.className = "message-content";
    content.append(this.#renderContent());

    const footer = document.createElement("div");
    footer.className = "message-footer";

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = new Date(this.timestamp).toLocaleTimeString();

    footer.append(time);

    const favBtn = document.createElement("button");
    favBtn.className = "btn-favorite";
    favBtn.type = "button";
    favBtn.textContent = this.isFavorite ? "★" : "☆";
    favBtn.title = this.isFavorite ? "Убрать из избранного" : "В избранное";
    favBtn.addEventListener("click", () => {
      root.dispatchEvent(
        new CustomEvent("toggle-favorite", {
          bubbles: true,
          detail: { id: this.id },
        }),
      );
    });
    footer.append(favBtn);

    if (this.fileUrl) {
      const downloadBtn = document.createElement("a");
      downloadBtn.className = "btn-download";
      downloadBtn.href = `/api/messages/${this.id}/download`;
      downloadBtn.title = "Скачать";
      downloadBtn.setAttribute("download", this.fileName || "");

      const icon = document.createElement("img");
      icon.src = "/icons/download.png";
      icon.alt = "Скачать";
      icon.className = "btn-download-icon";

      downloadBtn.append(icon);
      footer.append(downloadBtn);
    }

    root.append(content, footer);
    return root;
  }

  #renderContent() {
    switch (this.type) {
      case "image": {
        const img = document.createElement("img");
        img.src = this.fileUrl;
        img.alt = this.fileName || "image";
        img.loading = "lazy";
        img.className = "message-image";
        return img;
      }
      case "video": {
        const video = document.createElement("video");
        video.src = this.fileUrl;
        video.controls = true;
        video.className = "message-video";
        return video;
      }
      case "audio": {
        const audio = document.createElement("audio");
        audio.src = this.fileUrl;
        audio.controls = true;
        audio.className = "message-audio";
        return audio;
      }
      case "file": {
        const a = document.createElement("a");
        a.href = this.fileUrl;
        a.download = this.fileName || "";
        a.textContent = `📎 ${this.fileName}`;
        a.className = "message-file";
        return a;
      }
      default: {
        const frag = document.createDocumentFragment();
        frag.append(...linkify(this.content));
        return frag;
      }
    }
  }
}
