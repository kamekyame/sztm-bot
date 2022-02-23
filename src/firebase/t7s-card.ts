import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, setDoc, collection, onSnapshot, addDoc } = firestore;

const TweetColName = "t7s-card-tweets";
const CardColName = "t7s-card-cards";
const UserColName = "t7s-carf-users";

type TweetData = {
  playerId: string;
  cardId: string;
  date: string;
};
type CardData = {
  rare: string;
  charactor: string;
  name: string;
  url: string;
};
type UserData = {
  id: string;
  name: string;
  username: string;
};

const cardData = new Map<string, CardData>();

const _unsubscribe = onSnapshot(collection(db, CardColName), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added" || change.type === "modified") {
      cardData.set(change.doc.id, change.doc.data() as CardData);
      // console.log("New data: ", change.doc.data());
    }
    if (change.type === "removed") {
      cardData.delete(change.doc.id);
      // console.log("Removed data: ", change.doc.data());
    }
  });
});

export const setCard = async (data: CardData) => {
  let cardId: string | undefined;

  for (const [id, card] of cardData) {
    // console.log(id, card);
    if (
      card.rare === data.rare &&
      card.charactor === data.charactor &&
      card.name === data.name
    ) {
      cardId = id;
      break;
    }
  }
  if (cardId) {
    await setDoc(doc(db, CardColName, cardId), data);
  } else {
    const docRef = await addDoc(collection(db, CardColName), data);
    cardId = docRef.id;
  }
  return cardId;
};

export const setTweet = async (tweetId: string, data: TweetData) => {
  await setDoc(doc(db, TweetColName, tweetId), data);
};

export const setUser = async (playerId: string, data: UserData) => {
  await setDoc(doc(db, UserColName, playerId), data, { merge: true });
};
