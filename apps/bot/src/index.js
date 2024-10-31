const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log("=> token", token);
const url = "https://gameofblocks.io";

const bot = new TelegramBot(token, {
  webHook: true,
});

bot.on("polling_error", (error) => {
  console.log(error);
});

const menuButton = {
  text: "Play",
  type: "web_app",
  web_app: {
    url,
  },
};

bot.setChatMenuButton({
  menu_button: JSON.stringify(menuButton),
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  // const action = callbackQuery.data;
  // const msg = callbackQuery.message;

  console.log("callbackQuery", callbackQuery);

  // const opts = {
  //   chat_id: msg.chat.id,
  //   message_id: msg.message_id,
  // };
  // let text;

  // if (action === 'edit') {
  //   text = 'Edited Text';
  // }

  // bot.editMessageText(text, opts);
});

bot.on("message", function onMessage(msg) {
  console.log("test");

  bot.sendMessage(msg.chat.id, "I am alive!");
});

(async () => {
  const res = await bot.setWebHook(
    `https://5875-2a01-e0a-d1a-3790-edfa-4355-8ac-3d6e.ngrok-free.app/api/webhook/${process.env.WEBHOOK_SECRET}`
  );

  console.log("res", res);
})();
