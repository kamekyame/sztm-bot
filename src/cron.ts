import { Cron } from "./deps.ts";
import { cronOptions } from "./util.ts";

import { roboconInfoTweet } from "./cron/robocon_info.ts";
import { mydnsUpdateDNS } from "./cron/mydns_update.ts";

// 毎日0時にDNS情報をアップデート
new Cron("0 0 0 * * *", cronOptions, mydnsUpdateDNS);

// 毎日7時にロボコン情報をツイート
new Cron("0 0 7 * * *", cronOptions, roboconInfoTweet);
