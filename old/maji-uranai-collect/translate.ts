import { StreamTweet, TweetObject, datetime } from "../../src/deps.ts";
import {
  setLuckyColor,
  setLuckyZodiac,
} from "../../src/firebase/maji-uranai-collect.ts";

type Data = { value: string; badValue: string; date: string }[];

throw Error("data already upload");

const colors = JSON.parse(
  await Deno.readTextFile("old/maji-uranai-collect/colors.json")
);
updateFirestore(colors, setLuckyColor);

const zodiac = JSON.parse(
  await Deno.readTextFile("old/maji-uranai-collect/zodiac-signs.json")
);
updateFirestore(zodiac, setLuckyZodiac);

async function updateFirestore(
  data: Data,
  updateFn: typeof setLuckyColor | typeof setLuckyZodiac
) {
  for await (const d of data) {
    const { value: lucky, badValue: unlucky, date: rawDate } = d;
    const date = datetime.format(new Date(rawDate), "yyyy-MM-dd");

    const data = { lucky, unlucky };

    await updateFn(date, { lucky, unlucky });
    console.log("add", date, data);
    //Deno.exit();
  }
}
