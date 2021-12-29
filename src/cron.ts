import { Cron } from "./deps.ts";
import { cronOptions } from "./util.ts";

import { roboconInfoTweet } from "./cron/robocon_info.ts";

new Cron("0 0 7 * * *", cronOptions, () => {
  roboconInfoTweet();
});
