import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, setDoc, collection, onSnapshot } = firestore;

const colName = "maji-uranai";

type Data = {
  color?: { lucky: string; unlucky: string };
  zodiac?: { lucky: string; unlucky: string };
};

const data: { [key: string]: Data } = {};

const _unsubscribe = onSnapshot(collection(db, colName), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added" || change.type === "modified") {
      data[change.doc.id] = change.doc.data();
      // console.log("New data: ", change.doc.data());
    }
    if (change.type === "removed") {
      delete data[change.doc.id];
      // console.log("Removed data: ", change.doc.data());
    }
  });
});

export const setLuckyColor = async (date: string, data: Data["color"]) => {
  await setDoc<Data>(doc(db, colName, date), { color: data }, { merge: true });
};
export const setLuckyZodiac = async (date: string, data: Data["zodiac"]) => {
  await setDoc<Data>(doc(db, colName, date), { zodiac: data }, { merge: true });
};

export const getData = () => data;
