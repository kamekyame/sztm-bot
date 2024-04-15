import { Router } from "oak";
import { getData } from "../firebase/t7s-resume.ts";

export const t7sResume = new Router().get("/data", (ctx) => {
  ctx.response.body = getData();
});
