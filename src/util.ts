import { Cron, ptera } from "./deps.ts";

export const tzTokyo = "Asia/Tokyo";

type CronOptions = ConstructorParameters<typeof Cron>[1];

export const cronOptions: CronOptions = { timezone: tzTokyo };

export const getDayDiff = (from: ptera.DateTime, to: ptera.DateTime) => {
  const diffMillisec = to.startOfDay().toUTC().toMilliseconds() -
    from.startOfDay().toUTC().toMilliseconds();
  const diffDay = Math.floor(diffMillisec / ptera.MILLISECONDS_IN_DAY);
  return diffDay;
};
