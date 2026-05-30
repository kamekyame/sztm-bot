import * as ptera from "ptera";
import { getDayDiff, tzTokyo } from "./../util.ts";
import { twitterClient } from "../twitter_util.ts";

import roboconInfo from "../../data/robocon_info.json" with { type: "json" };

const YEAR = "2026";

const keyToName: Record<string, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kinki: "近畿",
  tokaiHokuriku: "東海北陸",
  kantoKoshinetsu: "関東甲信越",
  cyugoku: "中国",
  sikoku: "四国",
  kyusyuOkinawa: "九州沖縄",
  zenkoku: "🎖全国",
};
const maxNameLength = Math.max(
  ...Object.values(keyToName).map((v) => v.length),
);

export async function roboconInfoTweet() {
  const { name, date } = roboconInfo[YEAR];
  const nowDate = ptera.datetime().toZonedTime(tzTokyo);

  let status = `ロボコン${YEAR}「${name}」\n\n`;
  Object.entries(date).forEach(([key, value]) => {
    const tournamentName = `${keyToName[key]}まで`.padEnd(
      maxNameLength + 2,
      "　",
    );
    if (key === "zenkoku") status += "\n";
    const tournamentDate = ptera.datetime(value).toZonedTime(tzTokyo);
    const diff = getDayDiff(nowDate, tournamentDate);
    status += `${tournamentName} ${diff}日\n`;
  });

  status += "\n#ロボコン";
  // console.log(status);

  const res = await twitterClient.v2.tweet(status);
  if (res.errors) {
    console.error("[cron/robocon_info] Tweet failed.");
    console.error(res.errors);
    console.error(status, status.length);
    return;
  }
  // console.log(res);
  const tweetId = res.data.id;
  console.log(
    `[cron/robocon_info] Tweeted Robocon Info: https://twitter.com/_/status/${tweetId}`,
  );
}

if (import.meta.main) roboconInfoTweet();
