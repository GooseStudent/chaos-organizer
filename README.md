# Chaos Organizer

Бот-органайзер для хранения информации, поиска и других сервисов. Реализован как веб-приложение с чат-интерфейсом по типу Telegram/WhatsApp.

## Ссылки

- **Frontend (GitHub Pages):** https://goosestudent.github.io/chaos-organizer/
- **Backend (Render):** https://chaos-organizer-2p5r.onrender.com
- **Репозиторий:** https://github.com/GooseStudent/chaos-organizer

## Реализованные функции

### Обязательные:
- [✅] Сохранение текстовых сообщений и ссылок
- [✅] Кликабельные ссылки (http:// или https://)
- [✅] Сохранение изображений, видео и аудио (Drag & Drop и иконка загрузки)
- [✅] Скачивание файлов на компьютер
- [✅] Ленивая подгрузка (по 10 сообщений при скролле)

### Дополнительные ():
- [✅] Синхронизация между вкладками (WebSocket)
- [✅] Избранное
- [✅] Просмотр вложений по категориям
- [✅] Поиск по сообщениям

## Технологии

### Frontend:
- JavaScript (ES6+)
- Webpack
- Babel
- CSS

### Backend:
- Node.js
- Koa
- WebSocket (ws)
- Хранение в памяти

## Запуск проекта

### Локальная разработка:

```bash
# Установка зависимостей
npm run install-all

# Запуск в режиме разработки
npm run dev
