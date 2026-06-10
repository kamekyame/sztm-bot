import { parse } from "@std/yaml";
import { green } from "@std/fmt/colors";

type Config = Record<string, {
  require: boolean;
  default?: string;
}>;

// Read config file
const envConfig = parse(getConfigStr()) as Config;
//console.log(envConfig);
function getConfigStr() {
  try {
    return Deno.readTextFileSync("./envconfig.yml");
  } catch (_) {
    throw Error("There is no envconfig.yml");
  }
}

// Check env
export const reqEnv: Record<string, string> = {};
export const nonReqEnv: Record<string, string | undefined> = {};
Object.entries(envConfig).forEach(([key, { require, default: def }]) => {
  const value = Deno.env.get(key);
  if (require) {
    if (value) reqEnv[key] = value;
    else {
      throw Error(
        `The following variables are not defined in the environment or '.env' : ${key}`,
      );
    }
  } else {
    if (def !== undefined) reqEnv[key] = value || def;
    else nonReqEnv[key] = value;
  }
});

console.log(green("[env]\tChecked environment"));
