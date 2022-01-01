import { getBearerToken, OAuth1Info } from "./deps.ts";
import { reqEnv } from "./env.ts";

export const auth: OAuth1Info = {
  consumerKey: reqEnv.API_KEY,
  consumerSecret: reqEnv.API_SECRET,
  token: reqEnv.TOKEN,
  tokenSecret: reqEnv.TOKEN_SECRET,
};

export const bearerToken = await getBearerToken(
  auth.consumerKey,
  auth.consumerSecret,
);
