import { Cron } from "./deps.ts";
import { cronOptions } from "./util.ts";

import { roboconInfoTweet } from "./cron/robocon_info.ts";
import { t7sInfoTweet } from "./cron/t7s_info.ts";

const crons = [
  // 毎日7時にロボコン情報をツイート
  new Cron("0 0 7 * * *", cronOptions, roboconInfoTweet),
  // 毎日7時30分にナナシス周年情報をツイート
  new Cron("0 30 7 * * *", cronOptions, t7sInfoTweet),
];

Deno.addSignalListener("SIGTERM", () => {
  for (const cron of crons) {
    cron.stop();
  }
  console.log("[cron] Stopped cron job.");
});
