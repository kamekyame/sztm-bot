import { statusUpdate, StreamTweet } from "../deps.ts";
import { auth } from "../twitter_util.ts";
import { type IStream } from "../stream.ts";

export class Fortune implements IStream {
  private readonly receiveUsername;

  private readonly tag = "fortuneBOT";
  private readonly value = () =>
    `@${this.receiveUsername} 占い -from:${this.receiveUsername}`;

  public readonly option = {
    expansions: { author_id: true },
  };

  constructor({ receiveUsername }: { receiveUsername: string }) {
    this.receiveUsername = receiveUsername;
  }

  public getRule() {
    return {
      value: this.value(),
      tag: this.tag,
    };
  }

  async callback(res: StreamTweet) {
    if (res.data.text.indexOf("占い") === -1) return;
    //console.log(res);
    let user;
    if (res.includes?.users && res.includes.users.length > 0) {
      user = res.includes.users[0];
    }
    if (!user) return;

    const status = `
@${user.username}
運勢とラッキーアイテム

#すずともBot`;

    const tweetRes = await statusUpdate(auth, {
      status,
      in_reply_to_status_id: res.data.id,
    });

    console.log(`[stream] @${user.username}を占ったよ\ttweetId:${tweetRes.id}`);
  }
}
