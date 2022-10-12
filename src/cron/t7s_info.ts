import { ptera, statusUpdate } from "../deps.ts";
import { getDayDiff, tzTokyo } from "../util.ts";
import { auth } from "../twitter_util.ts";

const t7sBirth = ptera.datetime("2014-02-19T00:00:00+09:00").toZonedTime(
  tzTokyo,
);

export async function t7sInfoTweet() {
  const nowDate = ptera.datetime().toZonedTime(tzTokyo);
  const diffFromBirth = getDayDiff(t7sBirth, nowDate);
  const nextAnivDate = getNextAnivDate();
  const diffFromNextAniv = getDayDiff(nowDate, nextAnivDate);
  const aniv = nextAnivDate.year - t7sBirth.year;

  let status = "";
  if (diffFromNextAniv === 0) {
    status += `今日はナナシス${aniv}周年記念日！\n`;
    status += `\nおめでとうございます！🎊🎊🎊🎊\n`;
  } else {
    const diffStr = ("    " + diffFromNextAniv).slice(-4);
    // console.log(diffStr);
    status += `ナナシス🍣${aniv}周年まで\n`;
    status += `＿人人人人人人人＿\n`;
    status += `＞ あと${diffStr} 日！ ＜\n`;
    status += `￣Y^Y^Y^Y^Y^Y^Y￣\n`;
  }

  status += `\nナナシスは今日で${diffFromBirth}日目\n`;
  status += `\n#ナナシス\n#t7s`;
  // console.log(status);

  const res = await statusUpdate(auth, { status });
  // console.log(res);
  const tweetId = res?.id_str;
  console.log(
    `[cron/t7s_info] Tweeted t7s Anniversary Info: https://twitter.com/_/status/${tweetId}`,
  );
}

function getNextAnivDate() {
  const nowYear = ptera.datetime().toZonedTime(tzTokyo).year; //.getUTCFullYear();
  let nextAnivDate = ptera.datetime().parse(
    nowYear + "/" + t7sBirth.format("MM/dd"),
    "YYYY/MM/dd",
  ).toZonedTime(tzTokyo); // new Date(t7sBirth);
  if (nextAnivDate.isBefore()) { // 次の周年日がマイナスの場合、既に経過しているので、次の周年日を設定する
    nextAnivDate = nextAnivDate.add({ year: 1 });
  }
  return nextAnivDate;
}

if (import.meta.main) {
  t7sInfoTweet();
}
