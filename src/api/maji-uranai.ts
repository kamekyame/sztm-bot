import { Router } from "@oak/oak";
import { getData } from "../firebase/maji-uranai-collect.ts";

export const majiUranai = new Router().get("/data", (ctx) => {
  ctx.response.body = getData();
});
