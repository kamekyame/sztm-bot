throw Error("data already upload");

import { firestore } from "../../src/deps.ts";
import { db } from "../../src/firebase.ts";
const { doc, setDoc } = firestore;

import users from "./janken-users.json" assert { type: "json" };

updateFirestore(users);
async function updateFirestore(data: typeof users) {
  for await (const d of data) {
    const { id, result } = d;

    await setDoc(doc(db, "janken", id), result);
    console.log("add", id, result);
    //Deno.exit();
  }
}
