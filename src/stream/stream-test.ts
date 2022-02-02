import { statusRetweet, StreamParam, StreamTweet } from "../deps.ts";
import { auth } from "../twitter_util.ts";
import { type IStream } from "../stream.ts";
import { setResumeTweet } from "../firebase/t7s-resume.ts";

export class Test implements IStream {
  private readonly tag = "testBOT";
  private readonly value = () => `あい`;
  public readonly option: StreamParam = {};

  constructor() {}

  public getRule() {
    return {
      value: this.value(),
      tag: this.tag,
    };
  }

  public async callback(res: StreamTweet) {
    console.log("test", res);
    // firestoreに保存
    // await setResumeTweet(res);

    // retweet
    // const _retweetRes = await statusRetweet(auth, res.data.id);
  }
}
