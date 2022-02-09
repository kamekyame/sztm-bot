import {
  changeRules,
  connectStream,
  getRules,
  StreamParam,
  StreamTweet,
} from "./deps.ts";
import { bearerToken } from "./twitter_util.ts";

import { Fortune } from "./stream/fortune.ts";
import { T7sResume } from "./stream/t7s-resume.ts";
import { MajiUranaiCollect } from "./stream/maji-uranai-collect.ts";
import { Test } from "./stream/stream-test.ts";

export interface IStream {
  readonly option: StreamParam;
  getRule: () => { value: string; tag: string };
  callback: (res: StreamTweet) => Promise<void>;
}

const receiveUsername = "botTest46558316";
// const receiveUsername = "SuzuTomo2001";

const bots: IStream[] = [
  new Fortune({ receiveUsername }),
  new T7sResume(),
  new MajiUranaiCollect({
    /*receiveUsername*/
  }),
  new Test(),
];

// await changeRules(bearerToken, {
//   delete: { ids: ["1406961011857395713"] },
// });

// Check rule
async function checkRule() {
  const needRules = bots.map((bot) => bot.getRule());

  let rules = await getRules(bearerToken);
  const addRules = needRules.filter(
    (needRule) => !rules.data?.some((rule) => rule.value === needRule.value)
  );
  const delRules = (rules.data || []).filter((rule) => {
    return needRules.some(
      (needRule) => needRule.tag === rule.tag && needRule.value !== rule.value
    );
  });
  console.log({ addRules, delRules });
  if (addRules.length > 0) {
    const aRules = await changeRules(bearerToken, { add: addRules });
    console.log(aRules);
  }
  if (delRules.length > 0) {
    const delRulesId = delRules.map((rule) => rule.id);
    const dRules = await changeRules(bearerToken, {
      delete: { ids: delRulesId },
    });
    console.log(dRules);
  }
  rules = await getRules(bearerToken);
  console.log("Rules", rules.data);
}
await checkRule();

let option: StreamParam = {};
for (const bot of bots) {
  option = { ...option, ...bot.option };
}
console.log("option", option);

// connectStream(
//   bearerToken,
//   (res) => {
//     console.log(`[stream] Tweet received: ${res.data.id}`);
//     //console.log(res);
//     for (const bot of bots) {
//       const rule = bot.getRule();
//       if (res.matching_rules.some((e) => e.tag === rule.tag)) {
//         console.log(`[stream] Matching rule: ${rule.tag}`);
//         bot.callback(res);
//       }
//     }
//   },
//   option
// ).finally(() => {
//   console.error("[stream] Connection closed .");
//   Deno.exit(1);
// });

const res = await fetch("https://api.twitter.com/2/tweets/search/stream", {
  headers: new Headers({
    Authorization: `Bearer ${bearerToken}`,
  }),
});
console.log(res);
if (res.body) {
  for await (const a of res.body) {
    try {
      const data = new TextDecoder().decode(a);
      if (data === "\r\n") continue;
      const json = JSON.parse(data);
      console.log(json);
      // if (json.errors) {
      //   json.errors.forEach((e) => {
      //     console.log("Error", e);
      //   });
      //   reconnect("Receive Error.", 10);
      //   return;
      // } else {
      //   //console.log(JSON.parse(data));

      //   setTimeout(() => callback(json as StreamTweet), 0);
      // }
    } catch (e) {
      if (e instanceof SyntaxError) continue;
      console.log(e);
      // return;
    }
  }
}
