import { ptera, statusUpdate, StreamParam, StreamTweet } from "../deps.ts";
import { tzTokyo } from "../util.ts";
import { auth } from "../twitter_util.ts";
import { type IStream } from "../stream.ts";
import {
  setLuckyColor,
  setLuckyZodiac,
} from "../firebase/maji-uranai-collect.ts";

const colors = [
  "赤",
  "青",
  "紫",
  "黒",
  "ピンク",
  "白",
  "茶",
  "黄色",
  "灰",
  "緑",
  "オレンジ",
];

const zodiacSigns = [
  "おひつじ座",
  "おうし座",
  "ふたご座",
  "かに座",
  "しし座",
  "おとめ座",
  "てんびん座",
  "さそり座",
  "いて座",
  "やぎ座",
  "みずがめ座",
  "うお座",
];

export class MajiUranaiCollect implements IStream {
  private readonly receiveUsername: string = "Hals_SC";

  private readonly tag = "maji-uranai-collectBOT";
  private readonly value = () =>
    `from:${this.receiveUsername} -is:retweet -is:quote -is:reply "【定期】⭐まぁじ占い⭐"`;
  public readonly option: StreamParam = {
    "tweet.fields": { created_at: true },
  };

  constructor({ receiveUsername }: { receiveUsername?: string }) {
    if (receiveUsername) this.receiveUsername = receiveUsername;
  }

  public getRule() {
    return { value: this.value(), tag: this.tag };
  }

  public async callback(res: StreamTweet) {
    console.log(res);

    const createdAt = res.data.created_at;
    if (!createdAt) throw new Error("Nothing created_at");
    const date = ptera.datetime(createdAt).toZonedTime(tzTokyo)
      .format("YYYY-MM-dd");
    if (!date) throw new Error("Nothing date");

    const text = res.data.text;
    const match = text.match(/…(.+)！/);
    if (!match) return;
    const lucky = match[1];
    //console.log(value);
    let unlucky: string;

    let bodyText: string;
    if (text.indexOf("ラッキーカラー") !== -1) {
      const filteredColor = colors.filter((c) => c !== lucky);
      unlucky = filteredColor[Math.floor(Math.random() * filteredColor.length)];

      setLuckyColor(date, { lucky, unlucky });

      bodyText = `今日のアンラッキーカラーは…${unlucky}`;
    } else if (text.indexOf("運勢がいいのは") !== -1) {
      const filteredSigns = zodiacSigns.filter((c) => c !== lucky);
      unlucky = filteredSigns[Math.floor(Math.random() * filteredSigns.length)];

      setLuckyZodiac(date, { lucky, unlucky });

      bodyText = `
今日一番運勢が悪いのは…
ごめんなさい。${unlucky}の方です(笑)`;
    } else return;

    let user;
    if (res.includes?.users && res.includes.users.length > 0) {
      user = res.includes.users[0];
    }
    if (!user) return;

    const status = `
@${user.username}
${bodyText}
#すずともBot
`;

    const tweetRes = await statusUpdate(auth, {
      status,
      in_reply_to_status_id: res.data.id,
    });

    console.log(`[stream] 👍:${lucky}\t👎:${unlucky}\ttweetId:${tweetRes.id}`);
  }
}
