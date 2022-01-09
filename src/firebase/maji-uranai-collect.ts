import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, setDoc } = firestore;

const colName = "maji-uranai";

type Data = {
  color?: { lucky: string; unlucky: string };
  zodiac?: { lucky: string; unlucky: string };
};

export const setLuckyColor = async (date: string, data: Data["color"]) => {
  await setDoc<Data>(doc(db, colName, date), { color: data }, { merge: true });
};
export const setLuckyZodiac = async (date: string, data: Data["zodiac"]) => {
  await setDoc<Data>(doc(db, colName, date), { zodiac: data }, { merge: true });
};
