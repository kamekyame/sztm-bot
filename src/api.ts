import { Application, Router, Status } from "./deps.ts";
import { reqEnv } from "./env.ts";
import { logger, responseTypeHeader } from "./api/middleware.ts";

const router = new Router();
router.get("/version", (ctx) => {
  ctx.response.status = Status.OK;
  ctx.response.body = reqEnv.HEROKU_RELEASE_VERSION;
});

// Oak application
const app = new Application();

app.use(logger);
app.use(responseTypeHeader);

app.use(router.routes());
app.use((ctx) => {
  ctx.response.status = Status.NotFound;
  ctx.response.body = { message: "Not Found" };
});
// Read Arguments
const port = parseInt(Deno.args[0]) || 8888;
app.listen({ port }).then(() => {
  Deno.exit(1);
});
console.log(`Listen to http://localhost:${port}/`);
