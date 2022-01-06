import { changeRules, connectStream, getRules, StreamParam } from "./deps.ts";
import { bearerToken } from "./twitter_util.ts";

import { Fortune } from "./stream/fortune.ts";
import { T7sResume } from "./stream/t7s-resume.ts";

//const receiveUsername = "botTest46558316";
const receiveUsername = "SuzuTomo2001";

const fortune = new Fortune({ receiveUsername });
const t7sResume = new T7sResume();

/*await changeRules(bearerToken, {
  delete: { ids: ["1406961011857395713"] },
});*/

// Check rule
async function checkRule() {
  const needRules = [fortune.getRule(), t7sResume.getRule()];

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

const option: StreamParam = {
  ...fortune.option,
  ...t7sResume.option,
};
//console.log("option", option);

connectStream(
  bearerToken,
  (res) => {
    //console.log(res);
    fortune.callback(res);
    t7sResume.callback(res);
  },
  option
).then(() => {
  Deno.exit(1);
});
