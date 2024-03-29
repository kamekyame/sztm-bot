import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, setDoc, onSnapshot, collection } = firestore;

const colName = "t7s-resume";

// deno-lint-ignore no-explicit-any
type Data = any; // StreamTweet; //& { checkTime: number; status: "active" | "inactive" };

const data: {
  [key: string]: Data;
} = {};

// async function checkTweet() {
//   for await (const tweet of Object.values(data)) {
//     if (tweet.checkTime < Date.now() - 1000 * 60 * 60 * 24) {
//       // 1日更新されてなかったら
//       const media = tweet.includes?.media && tweet.includes.media[0];
//       if (media?.url) {
//         const res = await fetch(media.url);
//         if (!res.ok) tweet.status = "inactive";
//       }
//     }
//   }
// }

const _unsubscribe = onSnapshot(collection(db, colName), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added" || change.type === "modified") {
      // const tweet = change.doc.data() as Data;
      // if (tweet.checkTime === undefined) {
      //   tweet.checkTime = 0;
      //   tweet.status = "active";
      // }
      data[change.doc.id] = change.doc.data() as Data;
      // console.log("New data: ", change.doc.data());
    }
    if (change.type === "removed") {
      delete data[change.doc.id];
      // console.log("Removed data: ", change.doc.data());
    }
  });
});

// deno-lint-ignore no-explicit-any
export const setResumeTweet = async (tweet: any /* StreamTweet */) => {
  const tweetId = tweet.data.id;
  // const data = { ...tweet, checkTime: Date.now(), status: "active" };
  await setDoc(doc(db, colName, tweetId), tweet);
};

export const getData = () => data;
