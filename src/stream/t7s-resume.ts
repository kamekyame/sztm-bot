import { statusRetweet, StreamParam, StreamTweet } from "../deps.ts";
import { auth } from "../twitter_util.ts";
import { setResumeTweet } from "../firebase/t7s-resume.ts";

export class T7sResume {
  private searchTexts = [
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
    if (!res.matching_rules.some((e) => e.tag === this.tag)) return;

    // firestoreに保存
    await setResumeTweet(res);

    // retweet
    const _retweetRes = await statusRetweet(auth, res.data.id);
  }
}

//Deno.writeTextFileSync(`./sample/res${count++}.json`, JSON.stringify(res));

// // 画像が無かったらreturn
// const media = res.includes?.media && res.includes.media[0];
// if (!media) return;
// if (media.type !== "photo") return;
// console.log("Get media!", media);

// let tweet: TweetObject | undefined = undefined;
// if (res.data.text.startsWith("RT")) {
//   const referencedTweets = res.data.referenced_tweets;
//   if (!referencedTweets) return;
//   if (referencedTweets[0].type !== "retweeted") return;

//   tweet = res.includes?.tweets?.find(
//     (tweet) => tweet.id === referencedTweets[0].id
//   );
// } else {
//   tweet = res.data;
// }
// if (!tweet) return;
// console.log("Get tweet!", tweet);

// const user = res.includes?.users?.find(
//   (user) => user.id === tweet?.author_id
// );
// if (!user) return;
// console.log("Get user!", user);

// const resume /*: Resume*/ = {
//   tweetId: tweet.id,
//   userId: user.id,
//   userName: user.username,
//   name: user.name,
//   date: tweet.created_at || null,
//   imageUrl: media.url || null,
//   res,
// };
// console.log(resume);
// this.addResume(resume);
