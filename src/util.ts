import * as ptera from "ptera";

export const tzTokyo = "Asia/Tokyo";

export const getDayDiff = (from: ptera.DateTime, to: ptera.DateTime) => {
  const diffMillisec = to.startOfDay().toUTC().toMilliseconds() -
    from.startOfDay().toUTC().toMilliseconds();
  const diffDay = Math.floor(diffMillisec / ptera.MILLISECONDS_IN_DAY);
  return diffDay;
};
