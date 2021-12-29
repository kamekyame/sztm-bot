import { statusUpdate} from "../deps.ts";
import { auth } from "../twitter_util.ts";

if (import.meta.main) roboconInfoTweet();

export async function roboconInfoTweet() {
  const res = await statusUpdate(auth, {
    status: "hello world!"+ new Date(),
  });
  
  console.log(res);
} 