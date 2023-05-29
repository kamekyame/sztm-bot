import { TwitterApi } from "./deps.ts";
import { reqEnv } from "./env.ts";

export const twitterClient = new TwitterApi({
  appKey: reqEnv.API_KEY,
  appSecret: reqEnv.API_SECRET,
  accessToken: reqEnv.TOKEN,
  accessSecret: reqEnv.TOKEN_SECRET,
});
