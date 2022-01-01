import { changeRules, connectStream, getRules, StreamParam } from "./deps.ts";
import { bearerToken } from "./twitter_util.ts";

import { Fortune } from "./stream/fortune.ts";

//const receiveUsername = "botTest46558316";
const receiveUsername = "SuzuTomo2001";

const fortune = new Fortune({ receiveUsername });

/*await changeRules(bearerToken, {
  delete: { ids: ["1477264300654075906", "1477262736480665600"] },
});*/

// Check rule
async function checkRule() {
  const needRules = [
    fortune.getRule(),
  ];

  let rules = await getRules(bearerToken);
  const addRules = needRules.filter((needRule) =>
    !rules.data?.some((rule) => rule.value === needRule.value)
  );
  if (addRules.length > 0) {
    console.log("addRules", addRules);
    const aRules = await changeRules(bearerToken, { add: addRules });
    console.log(aRules);
  }
  rules = await getRules(bearerToken);
  //console.log("Rules", rules.data);
}
await checkRule();

const option: StreamParam = {
  ...fortune.option,
};
//console.log("option", option);

connectStream(
  bearerToken,
  (res) => {
    //console.log(res);
    fortune.callback(res);
  },
  option,
).then(() => {
  Deno.exit(1);
});
