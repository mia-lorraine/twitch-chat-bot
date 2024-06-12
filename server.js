require("dotenv").config();

const tmi = require("tmi.js");

const regexpCommand = new RegExp(/(?:^!)?([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
  upvote: {
    response: (user) => `${user} was just upvoted`,
  },
  gn: {
    response: (user) => `goodnight, hope you sleep well <3 ${user}`,
  },
};
const client = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: ["mikapikachu_"],
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  console.log("message", message);

  let [raw, command, argument] = message.match(regexpCommand);
  if (message[0] == "!" && !self) command = message.replace("!", "");

  const { response } = commands[command] || {};

  if (typeof response === "function") {
    client.say(channel, response(tags.username));
  } else if (typeof response === "string") {
    client.say(channel, response);
  }

  console.log(`${tags["display-name"]}: ${message}`);
});
