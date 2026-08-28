export default class Sidebar {
  render(container) {
    container.innerHTML = `
      <div class="sidebar-header">
        <h3>Категории</h3>
      </div>
      <nav class="sidebar-nav">
        <a href="#" class="active">Все сообщения</a>
        <a href="#">
          <img src="/icons/image-gallery.png" alt="image-gallery" class="icon"/>Изображения</a>
        <a href="#">
          <img src="/icons/video.png" alt="video" class="icon"/>Видео</a>
        <a href="#">
          <img src="/icons/audio-file.png" alt="audio-file" class="icon"/>Аудио</a>
        <a href="#">
          <img src="/icons/file.png" alt="file" class="icon"/>Файлы</a>
        <a href="#">
          <img src="/icons/favourites.png" alt="favourites" class="icon"/>Избранное</a>
      </nav>
    `;

    container.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        container.querySelectorAll('a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
}