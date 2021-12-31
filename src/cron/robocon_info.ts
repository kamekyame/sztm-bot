import { statusUpdate } from "../deps.ts";
import { getDayDiff, translateDate } from "../util.ts";
import { auth } from "../twitter_util.ts";

import roboconInfo from "../../data/robocon_info.json" assert { type: "json" };

const YEAR = "2021";

const keyToName: Record<string, string> = {
  "hokkaido": "北海道地区",
  "tohoku": "東北地区",
  "kinki": "近畿地区",
  "tokaiHokuriku": "東海北陸地区",
  "kantoKoshinetsu": "関東甲信越地区",
  "cyugoku": "中国地区",
  "sikoku": "四国地区",
  "kyusyuOkinawa": "九州沖縄地区",
  "zenkoku": "全国",
};

export async function roboconInfoTweet() {
  const { name, date } = roboconInfo[YEAR];
  const nowDate = translateDate(new Date());

  let status = `ロボコン${YEAR}「${name}」\n\n`;
  Object.entries(date).forEach(([key, value]) => {
    const tournamentName = keyToName[key];
    if (tournamentName === "全国") status += "\n";
    const diff = getDayDiff(nowDate, new Date(value));
    status += `${tournamentName}大会まで ${diff}日\n`;
  });

  status += "\n#ロボコン";
  //console.log(status);

  const res = await statusUpdate(auth, { status });
  console.log(res);
}

if (import.meta.main) roboconInfoTweet();
