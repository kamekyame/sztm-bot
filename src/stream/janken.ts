import { statusUpdate, StreamTweet } from "../deps.ts";
import { auth } from "../twitter_util.ts";
import { type IStream } from "../stream.ts";

import { updateResult } from "../firebase/janken.ts";

enum Hand {
  Rock,
  Scissors,
  Paper,
}

enum Type {
  Katakana,
  Hiragana,
  Emoji,
}

const hands = [
  ["グー", "チョキ", "パー"],
  ["ぐー", "ちょき", "ぱー"],
  ["✊", "✌", "✋"],
];

export class Janken implements IStream {
  private readonly receiveUsername;

  private readonly tag = "jankenBOT";
  private readonly value = () =>
    `@${this.receiveUsername} -from:${this.receiveUsername} -is:retweet `;

  public readonly option = {
    expansions: {
      author_id: true,
    },
    "user.fields": {
      username: true,
    },
  };

  constructor({ receiveUsername }: { receiveUsername: string }) {
    this.receiveUsername = receiveUsername;
  }

  public getRule() {
    return {
      value: this.value(),
      tag: this.tag,
    };
  }

  async callback(res: StreamTweet) {
    let user;
    if (res.includes?.users && res.includes.users.length > 0) {
      user = res.includes.users[0];
    } else return;

    let count = 0;
    for (const hand of getHands(res.data.text)) {
      count++;

      let status = `@${user.username}`;
      let logText = "";
      if (count > 10) {
        status += `
  手が足りないんだけど…
  https://qiita.com/SuzuTomo2001/items/c3f986ba80d58d66beee`;
        logText += "手が足りないよぉ…";
      } else {
        // じゃんけん
        const botHand = rndHand();
        const result = judge(hand.hand, botHand);

        // ユーザ情報更新
        const data = await updateResult(user.id, result);

        // ツイート返信
        const resultText = () => {
          if (result === "draw") return "とあいこ！";
          else if (result === "lose") return "の負け！";
          else if (result === "win") return "の勝ち！";
        };
        status += `
あなた(${hands[hand.type][hand.hand]}) vs (${hands[hand.type][botHand]})すずとも
  
あなた${resultText()}
  
成績：${data.win}勝${data.lose}敗${data.draw}分
  
またじゃんけんしようね(o^―^o)`;

        // ログ記録
        logText += `${hands[hand.type][botHand]} vs ${
          hands[hand.type][hand.hand]
        }(@${user.username})`;
      }

      status += `\n#すずともBot`;
      const tweetRes = await statusUpdate(auth, {
        status,
        in_reply_to_status_id: res.data.id,
      });

      console.log(
        `[stream] @${user.username} とじゃんけん\t${logText}\ttweetId:${tweetRes.id}`,
      );

      if (count > 10) break;
    }
  }
}

function judge(myself: Hand, opponent: Hand) {
  const resultNum = (myself - opponent + 3) % 3;
  if (resultNum === 0) return "draw";
  else if (resultNum === 1) return "lose";
  else if (resultNum === 2) return "win";
  else throw Error(`Janken judge error. resultNum : ${resultNum}`);
}

function rndHand() {
  const hand = Math.floor(Math.random() * 3);
  return hand as Hand;
}

function* getHands(text: string) {
  const fHands = hands.flat();
  const find = text.matchAll(new RegExp(fHands.join("|"), "g"));

  for (const f of find) {
    for (const [tIdx, t] of hands.entries()) {
      for (const [hIdx, h] of t.entries()) {
        if (f[0] === h) {
          yield { hand: hIdx as Hand, type: tIdx as Type };
        }
      }
    }
  }
}
