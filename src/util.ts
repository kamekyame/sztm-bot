import { Cron, datetime } from "./deps.ts";

type CronOptions = ConstructorParameters<typeof Cron>[1];

export const cronOptions: CronOptions = { timezone: "Asia/Tokyo" };

// 海外サーバだとTimeZoneが変わってきて差がずれるので、日本時間と同じ日時でUTCにする関数
// 例：2020-01-01T07:00:00+09:00 -> 2020-01-01T07:00:00+00:00
export const translateDate = (() => {
  const timeZoneDiffMinutes = new Date().getTimezoneOffset() + 60 * 9;
  const timeZoneDiffMilliseconds = timeZoneDiffMinutes * 60 * 1000;
  console.log(timeZoneDiffMinutes);

  return (...date: ConstructorParameters<typeof Date>) => {
    return new Date(new Date(...date).getTime() + timeZoneDiffMilliseconds);
  };
})();

export const getDayDiff = (from: Date, to: Date) => {
  from.setUTCHours(0, 0, 0, 0);
  to.setUTCHours(0, 0, 0, 0);
  const diffTime = to.getTime() - from.getTime();
  return Math.floor(diffTime / datetime.DAY);
};
