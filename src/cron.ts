import { roboconInfoTweet } from "./cron/robocon_info.ts";
import { t7sInfoTweet } from "./cron/t7s_info.ts";

// 毎日7時(UTCで22時)にロボコン情報をツイート
Deno.cron("Robocon Info Post", "0 22 * * *", roboconInfoTweet);
// 毎日7時30分(UTCで22時30分)にナナシス周年情報をツイート
Deno.cron("t7s Info Post", "30 22 * * *", t7sInfoTweet);
