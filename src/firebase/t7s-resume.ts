import { firestore, StreamTweet } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, setDoc } = firestore;

const colName = "t7s-resume";

export const setResumeTweet = async (tweet: StreamTweet) => {
  const tweetId = tweet.data.id;
  await setDoc(doc(db, colName, tweetId), tweet);
};
