import { StreamTweet, TweetObject } from "../../src/deps.ts";
import { setResumeTweet } from "../../src/firebase/t7s-resume.ts";

const text = await Deno.readTextFile("old/t7s-resume/resumes.json");
const json = JSON.parse(text);

if (!Array.isArray(json)) Deno.exit(1);

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

console.log(json.length);

const resumes = json.flatMap((resume) => {
  // console.log(resume);
  let res;
  if (resume.res) {
    res = resume.res;
  } else {
    const { tweetId, userId, userName, name, date, imageUrl } = resume;
    if (!tweetId) return [];
    const streamTweet: DeepPartial<StreamTweet> = {
      data: {
        id: tweetId,
        author_id: userId,
        created_at: date,
      },
      includes: {
        users: [{ id: userId, name, username: userName }],
        media: [{ type: "photo", url: imageUrl }],
      },
    };
    res = streamTweet;
    //restore(res as StreamTweet);
    // console.log(res);
  }
  // console.log(res);
  return [res as StreamTweet];
  //await setResumeTweet(res);
  //console.log("add", res.data.id);
  //Deno.exit();
});

console.log("resumes count", resumes.length);
throw Error("data already upload");
for await (const res of resumes) {
  console.log(res);
  await setResumeTweet(res);
  console.log("add", res.data.id);
  //Deno.exit();
}

function _restore(res: StreamTweet) {
  // 画像が無かったらreturn
  const media = res.includes?.media && res.includes.media[0];
  if (!media) throw Error("no media");
  if (media.type !== "photo") return;
  console.log("Get media!", media);

  let tweet: TweetObject | undefined = undefined;
  if (/*res.data.text.startsWith("RT")*/ false) {
    // const referencedTweets = res.data.referenced_tweets;
    // if (!referencedTweets) return;
    // if (referencedTweets[0].type !== "retweeted") return;
    // tweet = res.includes?.tweets?.find(
    //   (tweet) => tweet.id === referencedTweets[0].id
    // );
  } else {
    tweet = res.data;
  }
  if (!tweet) throw Error("no tweet");
  console.log("Get tweet!", tweet);

  const user = res.includes?.users?.find(
    (user) => user.id === tweet?.author_id
  );
  if (!user) throw Error("no user");
  console.log("Get user!", user);

  const resume /*: Resume*/ = {
    tweetId: tweet.id,
    userId: user.id,
    userName: user.username,
    name: user.name,
    date: tweet.created_at || null,
    imageUrl: media.url || null,
    res,
  };
  console.log(resume);
  // this.addResume(resume);
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
