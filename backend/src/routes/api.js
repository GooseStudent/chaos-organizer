const Router = require('koa-router');
const messageController = require('../controllers/messageController.js');

const router = new Router({ prefix: '/api' });

router.get('/messages', messageController.getMessages);
router.post('/messages', messageController.createMessage);
router.delete('/messages/:id', messageController.deleteMessage);

router.post('/messages/:id/favorite', messageController.toggleFavorite);
router.get('/favorites', messageController.getFavorites);

router.post('/messages/:id/pin', messageController.pinMessage);
router.delete('/messages/pin', messageController.unpinMessage);
router.get('/messages/pin', messageController.getPinned);

module.exports = router;