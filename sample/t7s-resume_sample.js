const a = {
  data: {
    attachments: {
      media_keys: ["3_1478732428902809600"]
    },
    author_id: "1114188880255668224",
    created_at: "2022-01-05T14:18:53.000Z",
    id: "1478732739830751237",
    referenced_tweets: [{
      type: "retweeted",
      id: "1478732691839533056"
    }],
    text: "RT @botTest46558316: テストです。\n\n#ナナシス履歴書 https://t.co/Pg6hMlz09F"
  },
  includes: {
    media: [{
      media_key: "3_1478732428902809600",
      type: "photo",
      url: "https://pbs.twimg.com/media/FIWDTzaaQAABafL.jpg"
    }],
    users: [{
      id: "1114188880255668224",
      name: "botTester",
      username: "botTest46558316"
    }],
    tweets: [{
      attachments: [Object],
      author_id: "1114188880255668224",
      created_at: "2022-01-05T14:18:41.000Z",
      id: "1478732691839533056",
      text: "テストです。\n\n#ナナシス履歴書 https://t.co/Pg6hMlz09F"
    }]
  },
  matching_rules: [{
    id: "1406961011857395713",
    tag: "t7sResumeBOT"
  }]
}

const b = {
  data: {
    attachments: { media_keys: ["3_1478732428902809600"] },
    author_id: "1114188880255668224",
    created_at: "2022-01-05T14:18:41.000Z",
    id: "1478732691839533056",
    text: "テストです。\n\n#ナナシス履歴書 https://t.co/Pg6hMlz09F"
  },
  includes: {
    media: [
      {
        media_key: "3_1478732428902809600",
        type: "photo",
        url: "https://pbs.twimg.com/media/FIWDTzaaQAABafL.jpg"
      }
    ],
    users: [{ id: "1114188880255668224", name: "botTester", username: "botTest46558316" }]
  },
  matching_rules: [{ id: "1406961011857395713", tag: "t7sResumeBOT" }]
}