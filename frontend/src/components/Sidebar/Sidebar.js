export default class Sidebar {
  render(container) {
    container.innerHTML = `
      <div class="sidebar-header">
        <h3>Категории</h3>
      </div>
      <nav class="sidebar-nav">
        <a href="#" class="active" data-filter="all">
          <img src="/icons/all.png" alt="" class="icon" />
          Все сообщения
        </a>
        <a href="#" data-filter="image">
          <img src="/icons/image-gallery.png" alt="" class="icon" />
          Изображения
        </a>
        <a href="#" data-filter="video">
          <img src="/icons/video.png" alt="" class="icon" />
          Видео
        </a>
        <a href="#" data-filter="audio">
          <img src="/icons/audio-file.png" alt="" class="icon" />
          Аудио
        </a>
        <a href="#" data-filter="file">
          <img src="/icons/file.png" alt="" class="icon" />
          Файлы
        </a>
        <a href="#" data-filter="favorites">
          <img src="/icons/favourites.png" alt="" class="icon" />
          Избранное
        </a>
      </nav>
    `;

    container.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        container
          .querySelectorAll("a")
          .forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        const filter = link.dataset.filter || "all";
        container.dispatchEvent(
          new CustomEvent("filter-change", {
            bubbles: true,
            detail: { filter },
          }),
        );
      });
    });
  }
}
