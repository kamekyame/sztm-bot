import { Cron } from "./deps.ts";
import { cronOptions } from "./util.ts";

import { roboconInfoTweet } from "./cron/robocon_info.ts";

//let count = 0;

new Cron("0 0 7 * * *", cronOptions, () => {
  roboconInfoTweet();
});
