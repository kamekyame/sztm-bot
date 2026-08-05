import { Buffer } from "node:buffer";
import * as ptera from "ptera";
import { getDayDiff, tzTokyo } from "../util.ts";
import { twitterClient } from "../twitter_util.ts";

const t7sBirth = ptera.datetime("2014-02-19T00:00:00+09:00").toZonedTime(
  tzTokyo,
);
const t7sServiceEnd = ptera.datetime("2026-08-12T14:59:00+09:00").toZonedTime(
  tzTokyo,
);

/** counter用の画像をPortfolioからダウンロードし、Twitterにアップロード */
const uploadImage = async (
  {
    aniv,
    diffAniv,
    count,
    diffEnd,
  }: {
    aniv: number;
    diffAniv: number;
    count: number;
    diffEnd: number;
  },
) => {
  let url: URL;
  const base = "https://kamekyame.com";
  if (diffEnd >= 0 && diffEnd < 30) {
    url = new URL("/api/t7s/counter/end", base);
    url.searchParams.set("diff-end", diffEnd.toString());
  } else if (diffAniv === 0) {
    url = new URL("/api/t7s/counter/aniv-image", base);
    url.searchParams.set("aniv", aniv.toString());
    url.searchParams.set("diff-aniv", diffAniv.toString());
    url.searchParams.set("count", count.toString());
  } else {
    url = new URL("/api/t7s/counter/image", base);
    url.searchParams.set("aniv", aniv.toString());
    url.searchParams.set("diff-aniv", diffAniv.toString());
    url.searchParams.set("count", count.toString());
  }

  const res = await fetch(url);
  const mimeType = res.headers.get("content-type") ?? "";
  const blob = await res.blob();

  const buf = await blob.arrayBuffer();
  const nodeBuf = Buffer.from(buf);

  const media = await twitterClient.v1.uploadMedia(nodeBuf, { mimeType });

  return media;
};

export async function t7sInfoTweet() {
  const nowDate = ptera.datetime().toZonedTime(tzTokyo);
  const diffEnd = getDayDiff(nowDate, t7sServiceEnd);
  if (diffEnd < 0) {
    return;
  }

  const diffFromBirth = getDayDiff(t7sBirth, nowDate);
  const nextAnivDate = getNextAnivDate();
  const diffFromNextAniv = getDayDiff(nowDate, nextAnivDate);
  const aniv = nextAnivDate.year - t7sBirth.year;

  const mediaId = await uploadImage({
    aniv: aniv,
    diffAniv: diffFromNextAniv,
    count: diffFromBirth,
    diffEnd,
  });

  let status = "";
  if (diffEnd === 0) {
    status += `ナナシスのゲームサービスは今日まで。\n`;
    status += `でも、ゲームはまだできるし、ナナシスもまだ終わらない。\n`;
    status += `ナナシスはナナシスじゃなくていい。\n`;
    status += `素晴らしいコンテンツと楽曲をこれからも推していきます！\n`;
    status += `ありがとう！！\n`;
  } else if (diffFromNextAniv === 0) {
    status += `今日はナナシス${aniv}周年記念日！\n`;
    status += `\nおめでとうございます！🎊🎊🎊🎊\n`;
  }
  status += `\n#ナナシス\n#t7s`;
  // console.log(status);
  const res = await twitterClient.v2.tweet(status, {
    media: { media_ids: [mediaId] },
  });
  const tweetId = res.data.id;
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
