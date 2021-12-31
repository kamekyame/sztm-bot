import { statusUpdate } from "../deps.ts";
import { getDayDiff, translateDate } from "../util.ts";
import { auth } from "../twitter_util.ts";

const t7sBirth = translateDate(new Date("2014-02-19T00:00:00+09:00"));

export async function t7sInfoTweet() {
  const nowDate = translateDate(new Date());
  // const nowDate = translateDate(new Date("2022-02-19T00:00:00+09:00"));
  nowDate.setHours(0, 0, 0, 0);
  const diffFromBirth = getDayDiff(t7sBirth, nowDate);
  const nextAnivDate = getNextAnivDate(nowDate);
  const diffFromNextAniv = getDayDiff(nowDate, nextAnivDate);
  const aniv = nextAnivDate.getUTCFullYear() - t7sBirth.getUTCFullYear();

  let status = "";
  if (diffFromNextAniv === 0) {
    status += `今日はナナシス${aniv}周年記念日！\n`;
    status += `\nおめでとうございます！🎊🎊🎊🎊\n`;
  } else {
    const diffStr = ("    " + diffFromNextAniv).slice(-4);
    console.log(diffStr);
    status += `ナナシス🍣${aniv}周年まで\n`;
    status += `＿人人人人人人人＿\n`;
    status += `＞ あと${diffStr} 日！ ＜\n`;
    status += `￣Y^Y^Y^Y^Y^Y^Y￣\n`;
  }

  status += `\nナナシスは今日で${diffFromBirth}日目\n`;
  status += `\n#ナナシス\n#t7s`;
  console.log(status);

  const res = await statusUpdate(auth, { status });
  console.log(res);
}

function getNextAnivDate(nowDate: Date) {
  const nowYear = nowDate.getUTCFullYear();
  const nextAnivDate = new Date(t7sBirth);
  nextAnivDate.setUTCFullYear(nowYear);
  const diff = getDayDiff(nowDate, nextAnivDate);
  // 次の周年日がマイナスの場合、既に経過しているので、次の周年日を設定する
  diff < 0 && nextAnivDate.setUTCFullYear(nowYear + 1);
  return nextAnivDate;
}

if (import.meta.main) t7sInfoTweet();
