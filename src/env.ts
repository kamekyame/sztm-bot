import { Colors, load, yamlParse } from "./deps.ts";

type Config = Record<string, {
  require: boolean;
  default?: string;
}>;

console.log(Colors.yellow("[env]\tCheck environment"));

// Read config file
const envConfig = yamlParse(getConfigStr()) as Config;
//console.log(envConfig);
function getConfigStr() {
  try {
    return Deno.readTextFileSync("./envconfig.yml");
  } catch (_) {
    throw Error("There is no envconfig.yml");
  }
}

// Read dotenv file
await load({
  export: true,
});

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

console.log(Colors.green("[env]\tChecked environment"));
