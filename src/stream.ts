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

export interface IStream {
  readonly option: StreamParam;
  getRule: () => { value: string; tag: string };
  callback: (res: StreamTweet) => Promise<void>;
}

// const receiveUsername = "botTest46558316";
const receiveUsername = "SuzuTomo2001";

const bots: IStream[] = [
  new Fortune({ receiveUsername }),
  new T7sResume(),
  new MajiUranaiCollect({
    /*receiveUsername*/
  }),
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
  if (addRules.length > 0) {
    console.log("addRules", addRules);
    const aRules = await changeRules(bearerToken, { add: addRules });
    console.log(aRules);
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

connectStream(
  bearerToken,
  (res) => {
    console.log(`[stream] Tweet received: ${res.data.id}`);
    //console.log(res);
    for (const bot of bots) {
      const rule = bot.getRule();
      if (res.matching_rules.some((e) => e.tag === rule.tag)) {
        bot.callback(res);
      }
    }
  },
  option
).then(() => {
  Deno.exit(1);
});
