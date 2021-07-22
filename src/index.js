import Koa from "koa";
const app = new Koa();

// database
const pgPromise = require("pg-promise")();
pgPromise.pg.defaults.ssl = true;
const db = pgPromise(process.env.DATABASE_URL);

// create table if not present
db.tx(async (t) => {
  try {
    await t.none("CREATE EXTENSION IF NOT EXISTS citext;");
    await t.none(
      `CREATE TABLE IF NOT EXISTS data (
      url CITEXT,
      id CITEXT,
      PRIMARY KEY(id, url)
    )`
    );
  } catch (e) {
    console.log(e);
  }
});

// cors
import cors from "@koa/cors";
app.use(cors());

// body parser
import bodyParser from "koa-bodyparser";
app.use(bodyParser());

// normally, I'd split routes into multiple files but keeping in this one for demo
import Router from "koa-router";
import shortId from "shortid";

const router = new Router();

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// cors
import cors from "@koa/cors";
app.use(cors());

// body parser
import bodyParser from "koa-bodyparser";
app.use(bodyParser());

// normally, I'd split routes into multiple files but keeping in this one for demo
import Router from "koa-router";

const router = new Router();

let emojis = [
  "😄",
  "😃",
  "😀",
  "😊",
  "☺",
  "😉",
  "😍",
  "😘",
  "😚",
  "😗",
  "😙",
  "😜",
  "😝",
  "😛",
  "😳",
  "😁",
  "😔",
  "😌",
  "😒",
  "😞",
  "😣",
  "😢",
  "😂",
  "😭",
  "😪",
  "😥",
  "😰",
  "😅",
  "😓",
  "😩",
  "😫",
  "😨",
  "😱",
  "😠",
  "😡",
  "😤",
  "😖",
  "😆",
  "😋",
  "😷",
  "😎",
  "😴",
  "😵",
  "😲",
  "😟",
  "😦",
  "😧",
  "😈",
  "👿",
  "😮",
  "😬",
  "😐",
  "😕",
  "😯",
  "😶",
  "😇",
  "😏",
  "😑",
  "👲",
  "👳",
  "👮",
  "👷",
  "💂",
  "👶",
  "👦",
  "👧",
  "👨",
  "👩",
  "👴",
  "👵",
  "👱",
  "👼",
  "👸",
  "😺",
  "😸",
  "😻",
  "😽",
  "😼",
  "🙀",
  "😿",
  "😹",
  "😾",
  "👹",
  "👺",
  "🙈",
  "🙉",
  "🙊",
  "💀",
  "👽",
  "💩",
  "🔥",
  "✨",
  "🌟",
  "💫",
  "💥",
  "💢",
  "💦",
  "💧",
  "💤",
  "💨",
  "👂",
  "👀",
  "👃",
  "👅",
  "👄",
  "👍",
  "👎",
  "👌",
  "👊",
  "✊",
  "✌",
  "👋",
  "✋",
  "👐",
  "👆",
  "👇",
  "👉",
  "👈",
  "🙌",
  "🙏",
  "☝",
  "👏",
  "💪",
  "🚶",
  "🏃",
  "💃",
  "👫",
  "👪",
  "👬",
  "👭",
  "💏",
  "💑",
  "👯",
  "🙆",
  "🙅",
  "💁",
  "🙋",
  "💆",
  "💇",
  "💅",
  "👰",
  "🙎",
  "🙍",
  "🙇",
  "🎩",
  "👑",
  "👒",
  "👟",
  "👞",
  "👡",
  "👠",
  "👢",
  "👕",
  "👔",
  "👚",
  "👗",
  "🎽",
  "👖",
  "👘",
  "👙",
  "💼",
  "👜",
  "👝",
  "👛",
  "👓",
  "🎀",
  "🌂",
  "💄",
  "💛",
  "💙",
  "💜",
  "💚",
  "❤",
  "💔",
  "💗",
  "💓",
  "💕",
  "💖",
  "💞",
  "💘",
  "💌",
  "💋",
  "💍",
  "💎",
  "👤",
  "👥",
  "💬",
  "👣",
  "💭",
  "🐶",
  "🐺",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🐸",
  "🐯",
  "🐨",
  "🐻",
  "🐷",
  "🐽",
  "🐮",
  "🐗",
  "🐵",
  "🐒",
  "🐴",
  "🐑",
  "🐘",
  "🐼",
  "🐧",
  "🐦",
  "🐤",
  "🐥",
  "🐣",
  "🐔",
  "🐍",
  "🐢",
  "🐛",
  "🐝",
  "🐜",
  "🐞",
  "🐌",
  "🐙",
  "🐚",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
  "🐋",
  "🐄",
  "🐏",
  "🐀",
  "🐃",
  "🐅",
  "🐇",
  "🐉",
  "🐎",
  "🐐",
  "🐓",
  "🐕",
  "🐖",
  "🐁",
  "🐂",
  "🐲",
  "🐡",
  "🐊",
  "🐫",
  "🐪",
  "🐆",
  "🐈",
  "🐩",
  "🐾",
  "💐",
  "🌸",
  "🌷",
  "🍀",
  "🌹",
  "🌻",
  "🌺",
  "🍁",
  "🍃",
  "🍂",
  "🌿",
  "🌾",
  "🍄",
  "🌵",
  "🌴",
  "🌲",
  "🌳",
  "🌰",
  "🌱",
  "🌼",
  "🌐",
  "🌞",
  "🌝",
  "🌚",
  "🌑",
  "🌒",
  "🌓",
  "🌔",
  "🌕",
  "🌖",
  "🌗",
  "🌘",
  "🌜",
  "🌛",
  "🌙",
  "🌍",
  "🌎",
  "🌏",
  "🌋",
  "🌌",
  "🌠",
  "⭐",
  "☀",
  "⛅",
  "☁",
  "⚡",
  "☔",
  "❄",
  "⛄",
  "🌀",
  "🌁",
  "🌈",
  "🌊",
  "🎍",
  "💝",
  "🎎",
  "🎒",
  "🎓",
  "🎏",
  "🎆",
  "🎇",
  "🎐",
  "🎑",
  "🎃",
  "👻",
  "🎅",
  "🎄",
  "🎁",
  "🎋",
  "🎉",
  "🎊",
  "🎈",
  "🎌",
  "🔮",
  "🎥",
  "📷",
  "📹",
  "📼",
  "💿",
  "📀",
  "💽",
  "💾",
  "💻",
  "📱",
  "☎",
  "📞",
  "📟",
  "📠",
  "📡",
  "📺",
  "📻",
  "🔊",
  "🔉",
  "🔈",
  "🔇",
  "🔔",
  "🔕",
  "📢",
  "📣",
  "⏳",
  "⌛",
  "⏰",
  "⌚",
  "🔓",
  "🔒",
  "🔏",
  "🔐",
  "🔑",
  "🔎",
  "💡",
  "🔦",
  "🔆",
  "🔅",
  "🔌",
  "🔋",
  "🔍",
  "🛁",
  "🛀",
  "🚿",
  "🚽",
  "🔧",
  "🔩",
  "🔨",
  "🚪",
  "🚬",
  "💣",
  "🔫",
  "🔪",
  "💊",
  "💉",
  "💰",
  "💴",
  "💵",
  "💷",
  "💶",
  "💳",
  "💸",
  "📲",
  "📧",
  "📥",
  "📤",
  "✉",
  "📩",
  "📨",
  "📯",
  "📫",
  "📪",
  "📬",
  "📭",
  "📮",
  "📦",
  "📝",
  "📄",
  "📃",
  "📑",
  "📊",
  "📈",
  "📉",
  "📜",
  "📋",
  "📅",
  "📆",
  "📇",
  "📁",
  "📂",
  "✂",
  "📌",
  "📎",
  "✒",
  "✏",
  "📏",
  "📐",
  "📕",
  "📗",
  "📘",
  "📙",
  "📓",
  "📔",
  "📒",
  "📚",
  "📖",
  "🔖",
  "📛",
  "🔬",
  "🔭",
  "📰",
  "🎨",
  "🎬",
  "🎤",
  "🎧",
  "🎼",
  "🎵",
  "🎶",
  "🎹",
  "🎻",
  "🎺",
  "🎷",
  "🎸",
  "👾",
  "🎮",
  "🃏",
  "🎴",
  "🀄",
  "🎲",
  "🎯",
  "🏈",
  "🏀",
  "⚽",
  "⚾",
  "🎾",
  "🎱",
  "🏉",
  "🎳",
  "⛳",
  "🚵",
  "🚴",
  "🏁",
  "🏇",
  "🏆",
  "🎿",
  "🏂",
  "🏊",
  "🏄",
  "🎣",
  "☕",
  "🍵",
  "🍶",
  "🍼",
  "🍺",
  "🍻",
  "🍸",
  "🍹",
  "🍷",
  "🍴",
  "🍕",
  "🍔",
  "🍟",
  "🍗",
  "🍖",
  "🍝",
  "🍛",
  "🍤",
  "🍱",
  "🍣",
  "🍥",
  "🍙",
  "🍘",
  "🍚",
  "🍜",
  "🍲",
  "🍢",
  "🍡",
  "🍳",
  "🍞",
  "🍩",
  "🍮",
  "🍦",
  "🍨",
  "🍧",
  "🎂",
  "🍰",
  "🍪",
  "🍫",
  "🍬",
  "🍭",
  "🍯",
  "🍎",
  "🍏",
  "🍊",
  "🍋",
  "🍒",
  "🍇",
  "🍉",
  "🍓",
  "🍑",
  "🍈",
  "🍌",
  "🍐",
  "🍍",
  "🍠",
  "🍆",
  "🍅",
  "🌽",
  "🏠",
  "🏡",
  "🏫",
  "🏢",
  "🏣",
  "🏥",
  "🏦",
  "🏪",
  "🏩",
  "🏨",
  "💒",
  "⛪",
  "🏬",
  "🏤",
  "🌇",
  "🌆",
  "🏯",
  "🏰",
  "⛺",
  "🏭",
  "🗼",
  "🗾",
  "🗻",
  "🌄",
  "🌅",
  "🌃",
  "🗽",
  "🌉",
  "🎠",
  "🎡",
  "⛲",
  "🎢",
  "🚢",
  "⛵",
  "🚤",
  "🚣",
  "⚓",
  "🚀",
  "✈",
  "💺",
  "🚁",
  "🚂",
  "🚊",
  "🚉",
  "🚞",
  "🚆",
  "🚄",
  "🚅",
  "🚈",
  "🚇",
  "🚝",
  "🚋",
  "🚃",
  "🚎",
  "🚌",
  "🚍",
  "🚙",
  "🚘",
  "🚗",
  "🚕",
  "🚖",
  "🚛",
  "🚚",
  "🚨",
  "🚓",
  "🚔",
  "🚒",
  "🚑",
  "🚐",
  "🚲",
  "🚡",
  "🚟",
  "🚠",
  "🚜",
  "💈",
  "🚏",
  "🎫",
  "🚦",
  "🚥",
  "⚠",
  "🚧",
  "🔰",
  "⛽",
  "🏮",
  "🎰",
  "♨",
  "🗿",
  "🎪",
  "🎭",
  "📍",
  "🚩",
  "⬆",
  "⬇",
  "⬅",
  "➡",
  "🔠",
  "🔡",
  "🔤",
  "↗",
  "↖",
  "↘",
  "↙",
  "↔",
  "↕",
  "🔄",
  "◀",
  "▶",
  "🔼",
  "🔽",
  "↩",
  "↪",
  "ℹ",
  "⏪",
  "⏩",
  "⏫",
  "⏬",
  "⤵",
  "⤴",
  "🆗",
  "🔀",
  "🔁",
  "🔂",
  "🆕",
  "🆙",
  "🆒",
  "🆓",
  "🆖",
  "📶",
  "🎦",
  "🈁",
  "🈯",
  "🈳",
  "🈵",
  "🈴",
  "🈲",
  "🉐",
  "🈹",
  "🈺",
  "🈶",
  "🈚",
  "🚻",
  "🚹",
  "🚺",
  "🚼",
  "🚾",
  "🚰",
  "🚮",
  "🅿",
  "♿",
  "🚭",
  "🈷",
  "🈸",
  "🈂",
  "Ⓜ",
  "🛂",
  "🛄",
  "🛅",
  "🛃",
  "🉑",
  "㊙",
  "㊗",
  "🆑",
  "🆘",
  "🆔",
  "🚫",
  "🔞",
  "📵",
  "🚯",
  "🚱",
  "🚳",
  "🚷",
  "🚸",
  "⛔",
  "✳",
  "❇",
  "❎",
  "✅",
  "✴",
  "💟",
  "🆚",
  "📳",
  "📴",
  "🅰",
  "🅱",
  "🆎",
  "🅾",
  "💠",
  "➿",
  "♻",
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
  "⛎",
  "🔯",
  "🏧",
  "💹",
  "💲",
  "💱",
  "©",
  "®",
  "™",
  "〽",
  "〰",
  "🔝",
  "🔚",
  "🔙",
  "🔛",
  "🔜",
  "❌",
  "⭕",
  "❗",
  "❓",
  "❕",
  "❔",
  "🔃",
  "🕛",
  "🕧",
  "🕐",
  "🕜",
  "🕑",
  "🕝",
  "🕒",
  "🕞",
  "🕓",
  "🕟",
  "🕔",
  "🕠",
  "🕕",
  "🕖",
  "🕗",
  "🕘",
  "🕙",
  "🕚",
  "🕡",
  "🕢",
  "🕣",
  "🕤",
  "🕥",
  "🕦",
  "✖",
  "➕",
  "➖",
  "➗",
  "♠",
  "♥",
  "♣",
  "♦",
  "💮",
  "💯",
  "✔",
  "☑",
  "🔘",
  "🔗",
  "➰",
  "🔱",
  "🔲",
  "🔳",
  "◼",
  "◻",
  "◾",
  "◽",
  "▪",
  "▫",
  "🔺",
  "⬜",
  "⬛",
  "⚫",
  "⚪",
  "🔴",
  "🔵",
  "🔻",
  "🔶",
  "🔷",
  "🔸",
  "🔹",
];

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
let randomChar = Math.random().toString(36).substring(2);

router
  .post("/", async (ctx) => {
    const { url } = ctx.request.body;

    const row = await db.oneOrNone("SELECT id FROM data WHERE url = $1", url);
    let id;
    if (row) {
      id = row.id;
    } else {
      id = randomEmoji() + randomEmoji() + randomChar;
      if (isValidUrl(url)) {
        await db.none("INSERT INTO data (url, id) VALUES ($1, $2)", [url, id]);
        ctx.body = {
          id: id,
        };
      } else {
        ctx.body = { error: "url tidak valid" };
      }
    }
  })
  .get("/:id", async (ctx) => {
    const row = await db.oneOrNone(
      "SELECT url FROM data WHERE id = $1",
      ctx.params.id
    );
    if (row) {
      let url = row.url;
      if (!url.startsWith("http")) {
        url = "http://" + url;
      }
      ctx.redirect(url);
    } else {
      ctx.throw(404);
    }
  });

app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV === "production") {
  const port = process.env.PORT || 8080;
  app.listen(port);
  console.log(`Listening on port ${port}`);
} else {
  app.listen(8080);
  console.log("Listening on port 8080");
}

