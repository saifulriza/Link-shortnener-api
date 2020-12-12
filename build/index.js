"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _cors = _interopRequireDefault(require("@koa/cors"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = new _koa["default"](); // database

var pgPromise = require("pg-promise")();

var db = pgPromise(process.env.DATABASE_URL); // create table if not present

db.tx( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return t.none("CREATE EXTENSION IF NOT EXISTS citext;");

          case 3:
            _context.next = 5;
            return t.none("CREATE TABLE IF NOT EXISTS data (\n      url CITEXT,\n      id CITEXT,\n      PRIMARY KEY(id, url)\n    )");

          case 5:
            _context.next = 9;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_unused) {
    return false;
  }
} // cors


app.use((0, _cors["default"])()); // body parser

app.use((0, _koaBodyparser["default"])()); // normally, I'd split routes into multiple files but keeping in this one for demo

var router = new _koaRouter["default"]();
var emojis = ["😄", "😃", "😀", "😊", "☺", "😉", "😍", "😘", "😚", "😗", "😙", "😜", "😝", "😛", "😳", "😁", "😔", "😌", "😒", "😞", "😣", "😢", "😂", "😭", "😪", "😥", "😰", "😅", "😓", "😩", "😫", "😨", "😱", "😠", "😡", "😤", "😖", "😆", "😋", "😷", "😎", "😴", "😵", "😲", "😟", "😦", "😧", "😈", "👿", "😮", "😬", "😐", "😕", "😯", "😶", "😇", "😏", "😑", "👲", "👳", "👮", "👷", "💂", "👶", "👦", "👧", "👨", "👩", "👴", "👵", "👱", "👼", "👸", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "👹", "👺", "🙈", "🙉", "🙊", "💀", "👽", "💩", "🔥", "✨", "🌟", "💫", "💥", "💢", "💦", "💧", "💤", "💨", "👂", "👀", "👃", "👅", "👄", "👍", "👎", "👌", "👊", "✊", "✌", "👋", "✋", "👐", "👆", "👇", "👉", "👈", "🙌", "🙏", "☝", "👏", "💪", "🚶", "🏃", "💃", "👫", "👪", "👬", "👭", "💏", "💑", "👯", "🙆", "🙅", "💁", "🙋", "💆", "💇", "💅", "👰", "🙎", "🙍", "🙇", "🎩", "👑", "👒", "👟", "👞", "👡", "👠", "👢", "👕", "👔", "👚", "👗", "🎽", "👖", "👘", "👙", "💼", "👜", "👝", "👛", "👓", "🎀", "🌂", "💄", "💛", "💙", "💜", "💚", "❤", "💔", "💗", "💓", "💕", "💖", "💞", "💘", "💌", "💋", "💍", "💎", "👤", "👥", "💬", "👣", "💭", "🐶", "🐺", "🐱", "🐭", "🐹", "🐰", "🐸", "🐯", "🐨", "🐻", "🐷", "🐽", "🐮", "🐗", "🐵", "🐒", "🐴", "🐑", "🐘", "🐼", "🐧", "🐦", "🐤", "🐥", "🐣", "🐔", "🐍", "🐢", "🐛", "🐝", "🐜", "🐞", "🐌", "🐙", "🐚", "🐠", "🐟", "🐬", "🐳", "🐋", "🐄", "🐏", "🐀", "🐃", "🐅", "🐇", "🐉", "🐎", "🐐", "🐓", "🐕", "🐖", "🐁", "🐂", "🐲", "🐡", "🐊", "🐫", "🐪", "🐆", "🐈", "🐩", "🐾", "💐", "🌸", "🌷", "🍀", "🌹", "🌻", "🌺", "🍁", "🍃", "🍂", "🌿", "🌾", "🍄", "🌵", "🌴", "🌲", "🌳", "🌰", "🌱", "🌼", "🌐", "🌞", "🌝", "🌚", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌜", "🌛", "🌙", "🌍", "🌎", "🌏", "🌋", "🌌", "🌠", "⭐", "☀", "⛅", "☁", "⚡", "☔", "❄", "⛄", "🌀", "🌁", "🌈", "🌊", "🎍", "💝", "🎎", "🎒", "🎓", "🎏", "🎆", "🎇", "🎐", "🎑", "🎃", "👻", "🎅", "🎄", "🎁", "🎋", "🎉", "🎊", "🎈", "🎌", "🔮", "🎥", "📷", "📹", "📼", "💿", "📀", "💽", "💾", "💻", "📱", "☎", "📞", "📟", "📠", "📡", "📺", "📻", "🔊", "🔉", "🔈", "🔇", "🔔", "🔕", "📢", "📣", "⏳", "⌛", "⏰", "⌚", "🔓", "🔒", "🔏", "🔐", "🔑", "🔎", "💡", "🔦", "🔆", "🔅", "🔌", "🔋", "🔍", "🛁", "🛀", "🚿", "🚽", "🔧", "🔩", "🔨", "🚪", "🚬", "💣", "🔫", "🔪", "💊", "💉", "💰", "💴", "💵", "💷", "💶", "💳", "💸", "📲", "📧", "📥", "📤", "✉", "📩", "📨", "📯", "📫", "📪", "📬", "📭", "📮", "📦", "📝", "📄", "📃", "📑", "📊", "📈", "📉", "📜", "📋", "📅", "📆", "📇", "📁", "📂", "✂", "📌", "📎", "✒", "✏", "📏", "📐", "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📚", "📖", "🔖", "📛", "🔬", "🔭", "📰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🎻", "🎺", "🎷", "🎸", "👾", "🎮", "🃏", "🎴", "🀄", "🎲", "🎯", "🏈", "🏀", "⚽", "⚾", "🎾", "🎱", "🏉", "🎳", "⛳", "🚵", "🚴", "🏁", "🏇", "🏆", "🎿", "🏂", "🏊", "🏄", "🎣", "☕", "🍵", "🍶", "🍼", "🍺", "🍻", "🍸", "🍹", "🍷", "🍴", "🍕", "🍔", "🍟", "🍗", "🍖", "🍝", "🍛", "🍤", "🍱", "🍣", "🍥", "🍙", "🍘", "🍚", "🍜", "🍲", "🍢", "🍡", "🍳", "🍞", "🍩", "🍮", "🍦", "🍨", "🍧", "🎂", "🍰", "🍪", "🍫", "🍬", "🍭", "🍯", "🍎", "🍏", "🍊", "🍋", "🍒", "🍇", "🍉", "🍓", "🍑", "🍈", "🍌", "🍐", "🍍", "🍠", "🍆", "🍅", "🌽", "🏠", "🏡", "🏫", "🏢", "🏣", "🏥", "🏦", "🏪", "🏩", "🏨", "💒", "⛪", "🏬", "🏤", "🌇", "🌆", "🏯", "🏰", "⛺", "🏭", "🗼", "🗾", "🗻", "🌄", "🌅", "🌃", "🗽", "🌉", "🎠", "🎡", "⛲", "🎢", "🚢", "⛵", "🚤", "🚣", "⚓", "🚀", "✈", "💺", "🚁", "🚂", "🚊", "🚉", "🚞", "🚆", "🚄", "🚅", "🚈", "🚇", "🚝", "🚋", "🚃", "🚎", "🚌", "🚍", "🚙", "🚘", "🚗", "🚕", "🚖", "🚛", "🚚", "🚨", "🚓", "🚔", "🚒", "🚑", "🚐", "🚲", "🚡", "🚟", "🚠", "🚜", "💈", "🚏", "🎫", "🚦", "🚥", "⚠", "🚧", "🔰", "⛽", "🏮", "🎰", "♨", "🗿", "🎪", "🎭", "📍", "🚩", "⬆", "⬇", "⬅", "➡", "🔠", "🔡", "🔤", "↗", "↖", "↘", "↙", "↔", "↕", "🔄", "◀", "▶", "🔼", "🔽", "↩", "↪", "ℹ", "⏪", "⏩", "⏫", "⏬", "⤵", "⤴", "🆗", "🔀", "🔁", "🔂", "🆕", "🆙", "🆒", "🆓", "🆖", "📶", "🎦", "🈁", "🈯", "🈳", "🈵", "🈴", "🈲", "🉐", "🈹", "🈺", "🈶", "🈚", "🚻", "🚹", "🚺", "🚼", "🚾", "🚰", "🚮", "🅿", "♿", "🚭", "🈷", "🈸", "🈂", "Ⓜ", "🛂", "🛄", "🛅", "🛃", "🉑", "㊙", "㊗", "🆑", "🆘", "🆔", "🚫", "🔞", "📵", "🚯", "🚱", "🚳", "🚷", "🚸", "⛔", "✳", "❇", "❎", "✅", "✴", "💟", "🆚", "📳", "📴", "🅰", "🅱", "🆎", "🅾", "💠", "➿", "♻", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "🔯", "🏧", "💹", "💲", "💱", "©", "®", "™", "〽", "〰", "🔝", "🔚", "🔙", "🔛", "🔜", "❌", "⭕", "❗", "❓", "❕", "❔", "🔃", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "✖", "➕", "➖", "➗", "♠", "♥", "♣", "♦", "💮", "💯", "✔", "☑", "🔘", "🔗", "➰", "🔱", "🔲", "🔳", "◼", "◻", "◾", "◽", "▪", "▫", "🔺", "⬜", "⬛", "⚫", "⚪", "🔴", "🔵", "🔻", "🔶", "🔷", "🔸", "🔹"];

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

var randomChar = Math.random().toString(36).substring(2);
router.post("/", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
    var url, row, id;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = ctx.request.body.url;

            if (!isValidUrl(url)) {
              _context2.next = 15;
              break;
            }

            _context2.next = 4;
            return db.oneOrNone("SELECT id FROM data WHERE url = $1", url);

          case 4:
            row = _context2.sent;

            if (!row) {
              _context2.next = 9;
              break;
            }

            id = row.id;
            _context2.next = 12;
            break;

          case 9:
            id = randomEmoji() + randomEmoji() + randomChar;
            _context2.next = 12;
            return db.none("INSERT INTO data (url, id) VALUES ($1, $2)", [url, id]);

          case 12:
            ctx.body = {
              id: id
            };
            _context2.next = 16;
            break;

          case 15:
            ctx.body = {
              error: 400,
              message: "Url tidak valid"
            };

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()).get("/:id", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
    var row, url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return db.oneOrNone("SELECT url FROM data WHERE id = $1", ctx.params.id);

          case 2:
            row = _context3.sent;

            if (row) {
              url = row.url;

              if (!url.startsWith("http")) {
                url = "http://" + url;
              }

              ctx.redirect(url);
            } else {
              ctx["throw"](404);
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV === "production") {
  var port = process.env.PORT || 8080;
  app.listen(port); // console.log(`Listening on port ${port}`);
} else {
  app.listen(8080); // console.log("Listening on port 8080");
}