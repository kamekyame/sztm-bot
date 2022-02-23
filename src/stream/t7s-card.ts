import { StreamTweet } from "../deps.ts";
import { type IStream } from "../stream.ts";
import { setCard, setTweet, setUser } from "../firebase/t7s-card.ts";

import { c } from "../../sample/t7s-card_sample.js";

export class T7sCard implements IStream {
  private readonly tag = "t7s-cardBOT";
  private readonly value = () =>
    `has:images -is:retweet -is:quote 【Tokyo 7th シスターズ】`;

  public readonly option = {
    expansions: { author_id: true, "attachments.media_keys": true },
    "tweet.fields": {
      created_at: true,
    },
    "user.fields": {
      username: true,
    },
    "media.fields": {
      duration_ms: true,
      height: true,
      media_key: true,
      preview_image_url: true,
      url: true,
      width: true,
      public_metrics: true,
      alt_text: true,
    },
  };

  constructor() {}

  public getRule() {
    return {
      value: this.value(),
      tag: this.tag,
    };
  }

  async callback(res: StreamTweet) {
    const tweetId = res.data.id;

    const match = res.data.text.match(
      /【Tokyo 7th シスターズ】(.+?)レアカード　(.+?)(?:　| )(.+?) GETしたよ.+【プレイヤーID】(\w+)/
    );
    // console.log(res, match);
    if (match === null) {
      console.log(res);
      return;
    }
    const [, rare, charactor, name, playerId] = match;

    let user;
    if (res.includes?.users && res.includes.users.length > 0) {
      user = res.includes.users[0];
    }
    if (!user) return;

    const media = res.includes?.media && res.includes?.media[0];
    if (!media) return;
    const imageUrl = media.url;
    if (!imageUrl) return;

    const createdAt = res.data.created_at;
    if (!createdAt) throw new Error("createdAt is null");

    const cardId = await setCard({
      rare,
      charactor,
      name,
      url: imageUrl,
    });
    await setTweet(tweetId, {
      playerId,
      cardId,
      date: createdAt,
    });
    await setUser(playerId, user);

    console.log(
      `[stream] t7s-card[${playerId}]: ${rare} ${charactor} ${name}\ttweetId:${tweetId}`
    );
  }
}

if (import.meta.main) {
  setTimeout(() => {
    const card = new T7sCard();
    card.callback(c as any);
  }, 1000);
}
