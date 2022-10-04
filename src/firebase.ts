import {
  firestore,
  getAuth,
  initializeApp,
  signInWithEmailAndPassword,
} from "./deps.ts";
import { reqEnv } from "./env.ts";

const { FIREBASE_EMAIL: email, FIREBASE_PASSWORD: password } = reqEnv;

const firebaseConfig = {
  apiKey: "AIzaSyAGNMd1nt_cVZEuOdtugzU2_3nsJbFn5CY",
  authDomain: "sztm-bot.firebaseapp.com",
  projectId: "sztm-bot",
  storageBucket: "sztm-bot.appspot.com",
  messagingSenderId: "167289737268",
  appId: "1:167289737268:web:c2b9206dd8996cc8c53a61",
  measurementId: "G-GB1TQHYMQ8",
};

// Initialize Firebase
const _app = initializeApp(firebaseConfig);

// Login
const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const _user = userCredential.user;
console.log("[firebase] Login Successed");

export const db = firestore.getFirestore();
