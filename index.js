console.log("Magic8 Starting")
require("dotenv").config()
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
app.listen(process.env.PORT);
const server = http.createServer(app)
const DBL = require('dblapi.js');
const BOATS = require('boats.js');
const { Client, Collection } = require("discord.js");
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
const bot = new Client(discordsettings);
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
bot.docs = bot.config.docs;
bot.github = bot.config.github;
bot.pack = require("./package.json");
bot.utils = require("./utils/methods.js");
bot.error = bot.utils.error;
bot.translate = bot.utils.getTranslation;
bot.webhooks = require("./utils/webhooks.js");
bot.links = require("./catched/links.json");
bot.canvas = require("canvas");
bot.fs = require("fs");
bot.fetch = require("node-fetch");
bot.hastebin = require("hastebin-gen");
bot.os = require("os");
bot.ms = require("pretty-ms");
bot.schedule = require("node-schedule");
bot.utils.loadDatabases(bot);
bot.colors = require("./utils/colors.json");
bot.color8 = require("./utils/color8.json");
bot.emoji = require("./utils/emojis.json");
bot.invite = "https://discord.gg/bUUggyCjvp";
bot.shortinvite = "discord.gg/bUUggyCjvp";
bot.supportserver = "610816275580583936";
bot.footer = ``;

bot.developer = undefined;
bot.maindeveloper = undefined;
bot.developerid = bot.config.ownerid
bot.maindeveloperid = bot.config.alonsoid

bot.schedule.scheduleJob("0 0 1 * *", function () {
  let guildsids = bot.guilds.cache.keyArray();
  let selected = bot.db.prepare("SELECT * FROM guilddata WHERE monthlyvotes!=?").all(0).filter(row => guildsids.includes(row.guildid));
  selected.forEach(row => {
    bot.db.prepare("UPDATE guilddata SET monthlyvotes=? WHERE guildid=?").run(0, row.guildid);
    bot.monthlyvotes.clear();
  });
  console.log(`☑️ Reset ${selected.length} guilds with monthly votes.`);
});
bot.schedule.scheduleJob("0 * * * *", async function () {
  bot.fs.copyFile('./data/guildData.db', `./templates/latestGuildData.db`, guildCallback);
  function guildCallback(err) {
    let logs = bot.channels.cache.get(bot.config.commandlogs);
    if (err) return logs.send(`${bot.emoji.cross} **Guild Data Backup Failed**\n\`\`\`${err}\`\`\``).catch(e => { });
    logs.send(`${bot.emoji.check} **Guild Data Backup Success**`, {
      files: [{
        attachment: `./templates/latestGuildData.db`,
        name: `latestGuildData.db`
      }]
    });
    return bot.developer.send(`${bot.emoji.check} **Guild Data Backup Success**`, {
      files: [{
        attachment: `./templates/latestGuildData.db`,
        name: `latestGuildData.db`
      }]
    });
  }
  bot.fs.copyFile('./data/usageData.db', `./templates/latestUsageData.db`, usageCallback);
  function usageCallback(err) {
    let logs = bot.channels.cache.get(bot.config.commandlogs);
    if (err) return logs.send(`${bot.emoji.cross} **Usage Data Backup Failed**\n\`\`\`${err}\`\`\``).catch(e => { });
    logs.send(`${bot.emoji.check} **Usage Data Backup Success**`, {
      files: [{
        attachment: `./templates/latestUsageData.db`,
        name: `latestUsageData.db`
      }]
    });
    return bot.developer.send(`${bot.emoji.check} **Usage Data Backup Success**`, {
      files: [{
        attachment: `./templates/latestUsageData.db`,
        name: `latestUsageData.db`
      }]
    });
  }
});
app.post("/votes", async function (request, response) {
  response.sendStatus(200)
  let auth = request.headers.authorization
  if (auth === process.env.TOPGG_AUTH) {
    bot.webhooks.dbl(bot, request);
  } else if (auth === process.env.DISCORD_BOATS_AUTH) {
    bot.webhooks.boats(bot, request);
  } else if (auth === process.env.DISCORD_LABS_TOKEN) {
    bot.webhooks.labs(bot, request);
  } else if (auth === process.env.BOT_LIST_TOKEN) {
    bot.webhooks.discordbotlist(bot, request);
  } else if (auth === process.env.BOTLISTSPACE_TOKEN) {
    bot.webhooks.botlistspace(bot, request);
  } else return;
});

bot.battling = new Collection();
bot.fakepingcooldown = new Collection();
bot.playerhacked = new Collection();
bot.onthephone = new Collection();
bot.playing8color = new Collection();
bot.playingakinator = new Collection();
bot.playinganagrams = new Collection();
bot.playingcasino = new Collection();
bot.playingconnect4 = new Collection();
bot.playingfindme = new Collection();
bot.playingmallet = new Collection()
bot.playingrtd = new Collection();
bot.playingslotmachine = new Collection();
bot.playingtictactoe = new Collection();
bot.playingtrivia = new Collection();
bot.spinningspinner = new Collection();
bot.welcomecasino = new Collection();
bot.playingimage = new Collection();

/*
const Scraper = require('images-scraper');
bot.google = new Scraper({
  puppeteer: {
    args: ['--no-sandbox'],
    devtools: false
  }
});
*/

bot.aliases = new Collection();
bot.commands = new Collection();
bot.events = new Collection();
bot.languages = new Collection();
bot.languagesprogress = new Collection();
bot.languagesprogress.set("en", { lang: "English", flag: "🇺🇸", progress: 100, authors: ["Fyrlex#2740", "AlonsoAliaga#0017"], link: "https://github.com/OfficialMagic8/languages/blob/master/languages/en.json" })
bot.lastfetched = new Collection();
bot.utils.fetchLanguages(bot);
app.get("/pingstatus", function (request, response) {
  response.sendStatus(200)
});
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

bot.prefixes = new Collection();

bot.duo = new Collection();
bot.trio = new Collection();
bot.squad = new Collection();
bot.avcategories = new Collection();
bot.avtempchannels = new Collection();
bot.voicecooldown = new Collection();

bot.listscooldown = new Collection();

bot.lfgusers = new Collection();
bot.lfgroles = new Collection();
bot.lfgnotifychannels = new Collection();

bot.antipingusers = new Collection();
bot.antipingbypassroles = new Collection();
bot.antipinglogchannels = new Collection();

bot.reactionchannels = new Collection();
bot.miscellaneouschannels = new Collection();
bot.minigamechannels = new Collection();
bot.funchannels = new Collection();

bot.repliestypes = new Collection();
bot.repliestypes.set("clean", 0)
bot.repliestypes.set("all", 1)
bot.repliestypes.set("explicit", 2)
bot.repliestypes.set("custom", 3)
bot.repliestypes.set(0, "clean")
bot.repliestypes.set(1, "all")
bot.repliestypes.set(2, "explicit")
bot.repliestypes.set(3, "custom")

bot.maxballreplies = new Collection();
bot.maxballreplies.set(0, 20);
bot.maxballreplies.set(1, 50);
bot.maxballreplies.set(2, 100);

bot.disabledcommands = new Collection();

bot.maxtoggledcommands = new Collection();
bot.maxtoggledcommands.set(0, 5);
bot.maxtoggledcommands.set(1, 10);
bot.maxtoggledcommands.set(2, 30);

bot.maxautovoicechannels = new Collection();
bot.maxautovoicechannels.set(0, 2);
bot.maxautovoicechannels.set(1, 3);
bot.maxautovoicechannels.set(2, 5);

bot.maxrestrictedchannels = new Collection();
bot.maxrestrictedchannels.set(0, 2);
bot.maxrestrictedchannels.set(1, 3);
bot.maxrestrictedchannels.set(2, 5);

bot.maxantipingusers = new Collection();
bot.maxantipingusers.set(0, 10);
bot.maxantipingusers.set(1, 20);
bot.maxantipingusers.set(2, 50);

bot.maxlists = new Collection();
bot.maxlists.set(0, 3)
bot.maxlists.set(1, 5)
bot.maxlists.set(2, 10)

bot.premium = new Collection();
bot.usage = new Collection();
bot.adtype = new Collection();
bot.ads = require("./utils/ads.json");

bot.monthlyvotes = new Collection();
bot.totalvotes = new Collection();

bot.mcservers = new Collection();

bot.calling = [];

bot.helpEmbed;
bot.staffEmbed;
bot.helpmenus = new Collection();
bot.adminmenus = new Collection();

bot.customemojisobject = require("./customemojis")
bot.customemojis = new Collection();
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
// bot.on("guildMemberAdd", member => {
//   let event = bot.events.get("guildMemberAdd");
//   if (event) event.run(bot, member)
// });
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
bot.utils.loadCommands(bot);
bot.utils.loadEvents(bot);

const nekoslifeclient = require("nekos.life");
bot.nekos = new nekoslifeclient();
module.exports = {
  bot: bot
};
bot.login(process.env.DISCORD_TOKEN);
bot.cleanTags = (message) => {
  return message.replace(/@everyone/gi, "<everyone>").replace(/@here/gi, "<here>")
}