import { firestore } from "../deps.ts";
import { db } from "../firebase.ts";
const { doc, updateDoc, getDoc, setDoc } = firestore;

const colName = "janken";

type Data = { win: number; lose: number; draw: number };
export type Result = keyof Data;

export const updateResult = async (userId: string, result: Result) => {
  const docRef = doc(db, colName, userId);
  const docSnap = await getDoc(docRef);
  let data: Data;
  if (docSnap.exists()) data = docSnap.data() as Data;
  else {
    data = { win: 0, lose: 0, draw: 0 };
    await setDoc(docRef, data);
  }

  data[result]++;

  await updateDoc(docRef, data);
  return data;
};
