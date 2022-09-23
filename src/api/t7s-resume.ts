import { Router } from "../deps.ts";
import { getData } from "../firebase/t7s-resume.ts";

export const t7sResume = new Router().get("/data", (ctx) => {
  ctx.response.body = getData();
});
