console.log("Magic8 starting up on GitHub!")
require("dotenv").config()
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json())
app.listen(process.env.PORT);
const server = http.createServer(app)
const Database = require('better-sqlite3');
const DBL = require('dblapi.js');
const BOATS = require('boats.js');
const Discord = require("discord.js");
const STATCORRD = require("statcord.js");
const discordsettings = {
  restRequestTimeout: 60000,
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_VOICE_STATES",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS"
    ]
  }
}
const bot = new Discord.Client(discordsettings);
bot.starttime = new Date()
const statcordsettings = {
  client: bot,
  key: process.env.STATCORD_TOKEN,
}
bot.statcord = new STATCORRD.Client(statcordsettings);
bot.statcord.on("autopost-start", () => {
  console.log("Auto-Posting Statcord");
});

bot.dbl = new DBL(process.env.DBL_TOKEN, { statsInterval: 1800000, webhookServer: server, webhookAuth: process.env.TOPGG_AUTH }, bot);
bot.boats = new BOATS(process.env.DISCORD_BOATS_AUTH);

bot.config = require("./config.json");
bot.docs = bot.config.docs
bot.github = bot.config.github
bot.pack = require("./package.json");
bot.utils = require("./utils/methods.js");
bot.error = bot.utils.error
bot.translate = bot.utils.getTranslation
bot.webhooks = require("./utils/webhooks.js")
bot.links = require("./catched/links.json");
bot.canvas = require("canvas")
bot.fs = require("fs");
bot.fetch = require("node-fetch")
bot.hastebin = require("hastebin-gen");
bot.os = require("os")
bot.ms = require("pretty-ms")
bot.schedule = require("node-schedule");
bot.db = new Database('./data/guildData.db');
bot.udb = new Database('./data/usageData.db');

bot.schedule.scheduleJob('0 0 1 * *', async function () {
  bot.guilds.cache.forEach(guild => {
    console.log(`☑️ Reset ${bot.monthlyvotes.size} guilds with monthly votes.`);
    if (bot.monthlyvotes.has(guild.id)) {
      bot.monthlyvotes.delete(guild.id)
    }
  })
});

app.post("/votes", async function (request, response) {
  response.sendStatus(200)
  if (request.headers.authorization === process.env.TOPGG_AUTH) {
    bot.webhooks.dbl(bot, request);
  } else if (request.headers.authorization === process.env.DISCORD_BOATS_AUTH) {
    bot.webhooks.boats(bot, request)
  } else if (request.headers.authorization === process.env.DISCORD_LABS_TOKEN) {
    bot.webhooks.labs(bot, request)
  } else if (request.headers.authorization === process.env.BOT_LIST_TOKEN) {
    bot.webhooks.discordbotlist(bot, request)
  } else return;
});

bot.battling = new Discord.Collection();
bot.fakepingcooldown = new Discord.Collection();
bot.playerhacked = new Discord.Collection();
bot.onthephone = new Discord.Collection();
bot.playing8color = new Discord.Collection();
bot.playingakinator = new Discord.Collection();
bot.playinganagrams = new Discord.Collection();
bot.playingcasino = new Discord.Collection();
bot.playingconnect4 = new Discord.Collection();
bot.playingfindme = new Discord.Collection();
bot.playingmallet = new Discord.Collection()
bot.playingrtd = new Discord.Collection();
bot.playingslotmachine = new Discord.Collection();
bot.playingtictactoe = new Discord.Collection();
bot.playingtrivia = new Discord.Collection();
bot.spinningspinner = new Discord.Collection();
bot.welcomecasino = new Discord.Collection();
bot.playingimage = new Discord.Collection();

/*
const Scraper = require('images-scraper');
bot.google = new Scraper({
  puppeteer: {
    args: ['--no-sandbox'],
    devtools: false
  }
});
*/

bot.aliases = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();
bot.languages = new Discord.Collection();
bot.languagesprogress = new Discord.Collection();
bot.languagesprogress.set("en", { lang: "English", flag: "🇺🇸", progress: 100, authors: ["Fyrlex#2740", "AlonsoAliaga#0017"], link: "https://github.com/OfficialMagic8/Languages/blob/master/languages/en.json" })
bot.lastfetched = new Discord.Collection();
bot.utils.fetchLanguages(bot);
app.get("/pingstatus", function (request, response) {
  response.sendStatus(200)
})
// app.get("/test", async function (request, response) {
//   response.json(bot.languages.get("en"))
//   let guildsids = bot.guilds.cache.keyArray();
//   let loaded = bot.db.prepare("SELECT * FROM guilddata WHERE usage!=?").all("[]").filter(row => guildsids.includes(row.guildid));
//   let finalarray = []
//   loaded.forEach(row => {
//     let garray = []
//     let x = JSON.parse(row.usage)
//     x.forEach(cmd => {
//       garray.push(cmd)
//     })
//     let o = {
//       guildid: row.guildid,
//       usage: garray
//     }
//     finalarray.push(o)
//   })
//   response.json(finalarray)
// })

bot.prefixes = new Discord.Collection();

bot.duo = 1;
bot.trio = 1;
bot.squad = 1;
bot.voicechannels = new Discord.Collection();
bot.voicecooldown = new Discord.Collection();

bot.listscooldown = new Discord.Collection();

bot.lfgusers = new Discord.Collection();
bot.lfgroles = new Discord.Collection();
bot.lfgnotifychannels = new Discord.Collection();

bot.antipingusers = new Discord.Collection();
bot.antipingbypassroles = new Discord.Collection();
bot.antipinglogchannels = new Discord.Collection();

bot.reactionchannels = new Discord.Collection();
bot.miscellaneouschannels = new Discord.Collection();
bot.minigamechannels = new Discord.Collection();
bot.funchannels = new Discord.Collection();

bot.responsestypes = new Discord.Collection();
bot.responsestypes.set("clean", 0)
bot.responsestypes.set("all", 1)
bot.responsestypes.set("explicit", 2)
bot.responsestypes.set("custom", 3)
bot.responsestypes.set(0, "clean")
bot.responsestypes.set(1, "all")
bot.responsestypes.set(2, "explicit")
bot.responsestypes.set(3, "custom")

bot.maxballresponses = new Discord.Collection();
bot.maxballresponses.set(0, 20);
bot.maxballresponses.set(1, 50);
bot.maxballresponses.set(2, 100);

bot.disabledcommands = new Discord.Collection();

bot.maxtoggledcommands = new Discord.Collection();
bot.maxtoggledcommands.set(0, 5);
bot.maxtoggledcommands.set(1, 10);
bot.maxtoggledcommands.set(2, 30);

bot.maxautovoicechannels = new Discord.Collection();
bot.maxautovoicechannels.set(0, 2);
bot.maxautovoicechannels.set(1, 3);
bot.maxautovoicechannels.set(2, 5);

bot.maxrestrictedchannels = new Discord.Collection();
bot.maxrestrictedchannels.set(0, 2);
bot.maxrestrictedchannels.set(1, 5);
bot.maxrestrictedchannels.set(2, 20);

bot.maxantipingusers = new Discord.Collection();
bot.maxantipingusers.set(0, 10);
bot.maxantipingusers.set(1, 20);
bot.maxantipingusers.set(2, 50);

bot.premium = new Discord.Collection();
bot.usage = new Discord.Collection();
bot.adtype = new Discord.Collection();
bot.ads = require("./utils/ads.json");

bot.maxusage = new Discord.Collection();
bot.maxusage.set(0, 100)
bot.maxusage.set(1, 250)
bot.maxusage.set(2, 500)

bot.monthlyvotes = new Discord.Collection();
bot.totalvotes = new Discord.Collection();

bot.mcservers = new Discord.Collection();

bot.calling = [];

bot.helpEmbed;
bot.staffEmbed;
bot.helpmenus = new Discord.Collection();
bot.adminmenus = new Discord.Collection();

bot.developer = undefined;
bot.maindeveloper = undefined;
bot.developerid = bot.config.ownerid
bot.maindeveloperid = bot.config.alonsoid
bot.colors = require("./utils/colors.json")
bot.color8 = require("./utils/color8.json")
bot.emoji = require("./utils/emojis.json")
bot.invite = "https://discord.gg/bUUggyCjvp"
bot.supportserver = "610816275580583936";
bot.footer = ``

bot.customemojisobject = require("./customemojis")
bot.customemojis = new Discord.Collection();
Object.keys(bot.customemojisobject).forEach(cat => {
  Object.keys(bot.customemojisobject[cat].emojis).forEach(identifier => {
    bot.customemojis.set(identifier, cat);
  });
});
function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
bot.on("ready", () => {
  let event = bot.events.get("ready");
  if (event) event.run(bot)
});
bot.on("channelDelete", channel => {
  let event = bot.events.get("channelDelete");
  if (event) event.run(bot, channel)
});
bot.on("debug", info => {
  let event = bot.events.get("debug");
  if (event) event.run(bot, info)
});
bot.on("error", error => {
  let event = bot.events.get("error");
  if (event) event.run(bot, error)
});
bot.on("guildCreate", guild => {
  let event = bot.events.get("guildCreate");
  if (event) event.run(bot, guild)
});
bot.on("guildDelete", guild => {
  let event = bot.events.get("guildDelete");
  if (event) event.run(bot, guild)
});
bot.on("guildMemberAdd", member => {
  let event = bot.events.get("guildMemberAdd");
  if (event) event.run(bot, member)
});
// bot.on("guildMembersChunk", () => {
//   let event = bot.events.get("guildMembersChunk");
//   if (event) event.run(bot)
// });
bot.on("guildMemberRemove", member => {
  let event = bot.events.get("guildMemberRemove");
  if (event) event.run(bot, member)
});
bot.on("guildMemberUpdate", (oldMember, newMember) => {
  let event = bot.events.get("guildMemberUpdate")
  if (event) event.run(bot, oldMember, newMember)
})
bot.on("guildUpdate", (oldGuild, newGuild) => {
  let event = bot.events.get("guildUpdate");
  if (event) event.run(bot, oldGuild, newGuild)
});
bot.on("message", message => {
  let event = bot.events.get("message");
  if (event) event.run(bot, message)
});
// bot.on("messageUpdate", (oldMessage, newMessage) => {
//   let event = bot.events.get("messageUpdate");
//   if (event) event.run(bot, oldMessage, newMessage)
// });
// bot.on("raw", raw => {
//   let event = bot.events.get("raw");
//   if (event) event.run(bot, raw)
// });
bot.on("roleDelete", role => {
  let event = bot.events.get("roleDelete");
  if (event) event.run(bot, role)
})
bot.on("voiceStateUpdate", (oldState, newState) => {
  let event = bot.events.get("voiceStateUpdate");
  if (event) event.run(bot, oldState, newState)
});

["command", "event"].forEach(handler => {
  require(`./handler/${handler}`)(bot);
});
const nekoslifeclient = require("nekos.life");
const { create } = require("domain");
bot.nekos = new nekoslifeclient();
module.exports = {
  bot: bot
};
bot.login(process.env.DISCORD_TOKEN);
bot.cleanTags = (message) => {
  return message.replace(/@everyone/gi, "<everyone>").replace(/@here/gi, "<here>")
}