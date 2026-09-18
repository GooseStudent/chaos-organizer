const Router = require("koa-router");
const multer = require("@koa/multer");
const path = require("path");
const crypto = require("crypto");

const messageController = require("../controllers/messageController.js");

const router = new Router({ prefix: "/api" });

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "public", "uploads"),
  filename: (ctx, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.get("/messages/search", messageController.search);
router.get("/messages/type/:type", messageController.getByType);
router.post("/messages/:id/favorite", messageController.toggleFavorite);
router.get("/favorites", messageController.getFavorites);
router.get("/messages/:id/download", messageController.downloadFile);
router.get("/messages", messageController.getMessages);
router.post("/messages", messageController.createMessage);
router.post(
  "/messages/upload",
  upload.single("file"),
  messageController.uploadFile,
);

module.exports = router;
