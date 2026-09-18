const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa-cors");
const serve = require("koa-static");
const path = require("path");

const apiRouter = require("./routes/api.js");

const app = new Koa();

app.use(cors({ origin: "*" }));
app.use(bodyParser({ jsonLimit: "50mb", formLimit: "50mb" }));

app.use(serve(path.join(__dirname, "..", "public")));

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

module.exports = app;
