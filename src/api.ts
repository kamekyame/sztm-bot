import { Application, Router, Status } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";

import { reqEnv } from "./env.ts";
import { logger, responseTypeHeader } from "./api/middleware.ts";
import { majiUranai } from "./api/maji-uranai.ts";
import { t7sResume } from "./api/t7s-resume.ts";

const router = new Router();
router.get("/version", (ctx) => {
  ctx.response.status = Status.OK;
  ctx.response.body = reqEnv.DENO_DEPLOYMENT_ID;
});
router.use("/maji-uranai", majiUranai.routes(), majiUranai.allowedMethods());
router.use("/t7s-resume", t7sResume.routes(), t7sResume.allowedMethods());

// Oak application
export const app = new Application();

app.use(logger);
app.use(responseTypeHeader);
app.use(oakCors());

app.use(router.routes());
app.use((ctx) => {
  ctx.response.status = Status.NotFound;
  ctx.response.body = { message: "Not Found" };
});
