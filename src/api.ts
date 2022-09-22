import { Application, oakCors, Router, Status } from "./deps.ts";
import { reqEnv } from "./env.ts";
import { logger, responseTypeHeader } from "./api/middleware.ts";

import { majiUranai } from "./api/maji-uranai.ts";

const router = new Router();
router.get("/version", (ctx) => {
  ctx.response.status = Status.OK;
  ctx.response.body = reqEnv.HEROKU_RELEASE_VERSION;
});
router.use("/maji-uranai", majiUranai.routes(), majiUranai.allowedMethods());

// Oak application
const app = new Application();

app.use(logger);
app.use(responseTypeHeader);
app.use(oakCors());

app.use(router.routes());
app.use((ctx) => {
  ctx.response.status = Status.NotFound;
  ctx.response.body = { message: "Not Found" };
});
// Read Arguments
const port = parseInt(reqEnv.PORT);

export const api = () => {
  const ac = new AbortController();
  console.log(`Listen to http://localhost:${port}/`);
  app.listen({ port, signal: ac.signal }).finally(() => {
    console.error("[api] Stopped API server.");
    // Deno.exit(1);
  });
  return ac;
};
