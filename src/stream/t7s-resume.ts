import { statusRetweet, StreamParam, StreamTweet } from "../deps.ts";
import { auth } from "../twitter_util.ts";
import { type IStream } from "../stream.ts";
import { setResumeTweet } from "../firebase/t7s-resume.ts";

export class T7sResume implements IStream {
  private searchTexts = [
    "#支配人履歴",
    "#支配人履歴書",
    "#ナナシス履歴書",
    "履歴書 支配人 更新",
    "履歴書 支配人 作成",
    "履歴書 ナナシス 更新",
    "履歴書 ナナシス 作成",
  ];

  private readonly tag = "t7sResumeBOT";
  private readonly value = () =>
    `has:images -is:retweet -is:quote (${this.searchTexts
      .map((e) => `(${e})`)
      .join(" OR ")})`;
  public readonly option: StreamParam = {
    expansions: {
      author_id: true,
      "attachments.media_keys": true,
      "referenced_tweets.id": true,
      "referenced_tweets.id.author_id": true,
    },
    "user.fields": { username: true },
    "tweet.fields": { created_at: true },
    "media.fields": { url: true, preview_image_url: true },
  };

  constructor() {}

  public getRule() {
    return {
      value: this.value(),
      tag: this.tag,
    };
  }

  public async callback(res: StreamTweet) {
    // firestoreに保存
    await setResumeTweet(res);

    // retweet
    const _retweetRes = await statusRetweet(auth, res.data.id);
  }
}
