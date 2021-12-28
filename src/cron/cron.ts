import { Cron } from "../deps.ts";
import { cronOptions } from "../util.ts";

const job = new Cron("0 * 10 * * *", cronOptions, () => {
});
