import { Cron } from "./deps.ts";
import { cronOptions } from "./util.ts";

import { roboconInfoTweet } from "./cron/robocon_info.ts";

// 毎日7時にロボコン情報をツイート
new Cron("0 0 7 * * *", cronOptions, roboconInfoTweet);
