import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} = firestore;

const TweetColName = "t7s-card-tweets";
const CardColName = "t7s-card-cards";
const UserColName = "t7s-carf-users";

type TweetData = {
  playerId?: string;
  playerRef?: firestore.DocumentReference;
  cardId?: string;
  cardRef?: firestore.DocumentReference;
  date: string | firestore.Timestamp;
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

/** レア度、キャラ名、カード名でカードを検索しリファレンスを返す。（無ければ新規登録）*/
export const getCardRef = async (data: CardData) => {
  const q = query(
    collection(db, CardColName),
    where("rare", "==", data.rare),
    where("charactor", "==", data.charactor),
    where("name", "==", data.name),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // 既存データがない場合、新規登録
    const docRef = await addDoc(collection(db, CardColName), data);
    return docRef;
  } else {
    return querySnapshot.docs[0].ref;
  }
};

export const setTweet = async (tweetId: string, data: TweetData) => {
  await setDoc(doc(db, TweetColName, tweetId), data);
};

export const setUser = async (playerId: string, data: UserData) => {
  await setDoc(doc(db, UserColName, playerId), data, { merge: true });
};

export const getUserRef = (playerId: string) => {
  return doc(db, UserColName, playerId);
};

// データ変換用関数
async function checkData() {
  const q = query(collection(db, TweetColName), orderBy("cardId"), limit(1000));
  const snapshot = await getDocs(q);
  console.log("checkData", snapshot.size, snapshot.empty);

  for await (const d of snapshot.docs) {
    const data = d.data() as TweetData;
    const playerId = data.playerId;
    const cardId = data.cardId;
    const date = data.date;
    if (
      playerId === undefined ||
      cardId === undefined ||
      typeof date !== "string"
    ) {
      continue;
    }
    const newData: TweetData = {
      playerRef: getUserRef(playerId),
      cardRef: doc(db, CardColName, cardId),
      date: firestore.Timestamp.fromDate(new Date(date)),
    };
    // console.log("chenge Data", data, newData);

    await setDoc(doc(db, TweetColName, d.id), newData);
    // console.log(doc.id, doc.data());
  }
}

// checkData();
// 1時間おきに実行
setInterval(checkData, 1000 * 60 * 60);
