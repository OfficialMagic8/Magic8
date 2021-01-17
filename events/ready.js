const { MessageEmbed } = require("discord.js");
const { loadMain, loadMCServers, loadAutoVoiceChannels, loadRestrictedChannels, loadLFGNotificationChannels, loadLFGRoles, loadAntiPingUsers, loadAntiPingChannels, loadAntiPingRoles, loadDisabledCommands, loadMonthlyVotes, loadTotalVotes, loadEmojis } = require("../utils/load")
module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`✅ Ready event loading... ${bot.user.tag}`);
    bot.statcord.autopost();
    bot.channels.cache.get("766108811978080267").messages.fetch().then(() => {
      bot.latestupdate.set("latestupdate", bot.channels.cache.get("766108811978080267").messages.cache.first().content);
    }).catch(e => { });
    loadMain(bot);
    loadMCServers(bot);
    loadAutoVoiceChannels(bot);
    loadRestrictedChannels(bot);
    loadLFGNotificationChannels(bot);
    loadLFGRoles(bot);
    loadAntiPingUsers(bot);
    loadAntiPingChannels(bot);
    loadAntiPingRoles(bot);
    loadDisabledCommands(bot);
    // loadMonthlyVotes(bot);
    // loadTotalVotes(bot);
    // loadVotedUsers(bot);
    loadEmojis(bot);
    bot.announcements = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.announcements);
    bot.updates = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.updates);
    bot.status = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.status);
    let statusList = [
      // { name: `on shard {SHARD}/{MAXSHARDS}`, type: "PLAYING" },
      // { name: `with ${bot.shard.count} shards`, type: "PLAYING" },
      { name: `with 20+ languages`, type: "PLAYING" },
      { name: `with new updates`, type: "PLAYING" },
      { name: `with your mind`, type: "PLAYING" },
      { name: `with your friends`, type: "PLAYING" },
      { name: `with your thoughts`, type: "PLAYING" },
      { name: `life`, type: "COMPETING" },
      { name: `by myself`, type: "PLAYING" },
      { name: `magic8.xyz`, type: "PLAYING" },
      { name: `magic8.xyz/docs`, type: "PLAYING" },
      { name: `magic8.xyz/discord`, type: "PLAYING" },
      { name: `for 2021 to suck`, type: "WATCHING" },
      { name: `{SERVERS} cool servers`, type: "WATCHING" },
      { name: `{USERS} amazing users`, type: "WATCHING" },
      { name: `for @Magic8`, type: "WATCHING" },
      { name: `for @Magic8 help`, type: "WATCHING" },
      { name: `for @Magic8 settings`, type: "WATCHING" },
      { name: `for @Magic8 langs`, type: "WATCHING" },
      { name: `for @Magic8 updates`, type: "WATCHING" },
      { name: `for new updates`, type: "WATCHING" },
    ];
    let statusSize = statusList.length - 1;
    // let maxshards = bot.shard.count;
    setInterval(async () => {
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      // bot.shard.ids.forEach(shard => {
      let status = statusList[statusSize];
      bot.user.setActivity(status.name.replace(/{SERVERS}/g, bot.guilds.cache.size).replace(/{USERS}/g, parseInt(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en"))/*.replace(/{SHARD}/g, shard).replace(/{MAXSHARDS}/g, maxshards)*/, { type: status.type/*, shardID: shard*/ }).catch(e => { });
      statusSize--;
      if (statusSize < 0) statusSize = statusList.length - 1;
      // });
    }, 20000);
    bot.user.setStatus("online").catch(e => { });
    bot.utils.fetchLanguages(bot);
    setTimeout(() => {
      bot.utils.loadLanguageProgress(bot);
    }, 5000)
    let date = new Date().toLocaleString().split(" ");
    let time = `${date[1]}${date[2]}`;
    let restartTime = bot.ms(new Date() - bot.starttime);
    console.log(`✅ Start Time: ${restartTime}`);
    // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
    // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
    console.log(`📊 Users: ${parseInt(bot.users.cache.filter(u => !u.bot).size.toLocaleString("en"))} - Guilds: ${bot.guilds.cache.size}`);
    let readyMsg = `${bot.emoji.check} __${time}__ ${bot.user} **successfully restarted!** Time: \`${restartTime}\` Ping: \`${bot.ms(bot.ws.ping)}\``;
    bot.channels.cache.get(bot.config.commandlogs).send(readyMsg).catch(e => { });
    let guildChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get("652539034404519936");
    if (guildChannel) {
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let guildText = `📚 Guilds : ${bot.guilds.cache.size}`;
      if (guildChannel.name !== guildText) {
        guildChannel.setName(guildText).catch(e => { });
      }
    }
    // postbfd(bot);
    postbbl(bot);
    postblistxyz(bot);
    postdiscordboats(bot);
    postdiscordextremelist(bot);
    setInterval(() => {
      if (guildChannel) {
        // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
        // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
        let guildText = `📚 Guilds : ${bot.guilds.cache.size}`;
        if (guildChannel.name !== guildText) {
          guildChannel.setName(guildText).catch(e => { });
        }
      }
      // postbfd(bot);
      postbbl(bot);
      postblistxyz(bot);
      postdiscordboats(bot);
      postdiscordextremelist(bot);
    }, 1800000)
    let userChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get("652538780376367104");
    if (userChannel) {
      let userText = `👥 Users : ${(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")}`;
      if (userChannel.name !== userText) {
        userChannel.setName(userText).catch(e => { });
      }
    }
    setInterval(() => {
      if (userChannel) {
        let userText = `👥 Users : ${(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")}`;
        if (userChannel.name !== userText) {
          userChannel.setName(userText).catch(e => { });
        }
      }
    }, 1800000)
    let monthlyVotesStats = "706888493145653339";
    bot.dbl.getBot(bot.user.id).then(botinfo => {
      let votesText = `📆 Monthly Votes: ${botinfo.monthlyPoints}`;
      let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(monthlyVotesStats);
      if (votesChannel) {
        if (votesChannel.name !== votesText) {
          votesChannel.setName(votesText).catch(e => { });
        }
      }
    }).catch(e => { });
    let totalVotesStats = "701902456052776960";
    bot.dbl.getBot(bot.user.id).then(botinfo => {
      let votesText = `💎 Total Votes: ${botinfo.points}`;
      let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(totalVotesStats);
      if (votesChannel) {
        if (votesChannel.name !== votesText) {
          votesChannel.setName(votesText).catch(e => { });
        }
      }
    }).catch(e => { });
    setInterval(() => {
      let monthlyVoteStats = "706888493145653339";
      bot.dbl.getBot("484148705507934208").then(botinfo => {
        let votesText = `📆 Monthly Votes: ${botinfo.monthlyPoints}`;
        let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(monthlyVoteStats);
        if (votesChannel) {
          if (votesChannel.name !== votesText) {
            votesChannel.setName(votesText).catch(e => { });
          }
        }
      }).catch(e => { });
      let totalVotesStats = "701902456052776960";
      bot.dbl.getBot("484148705507934208").then(botinfo => {
        let votesText = `💎 Total Votes: ${botinfo.points}`;
        let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(totalVotesStats);
        if (votesChannel) {
          if (votesChannel.name !== votesText) {
            votesChannel.setName(votesText).catch(e => { });
          }
        }
      }).catch(e => { });
    }, 60000);
    async function postdiscordbotlist(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discordbotlist.com/api/v1/bots/484148705507934208/stats";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.BOT_LIST_TOKEN);
      xhr.setRequestHeader("Content-Type", "application/json");
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState === 4) {
      //     // console.log(xhr.status);
      //     // console.log(xhr.responseText);
      //   }
      // };
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "guilds": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    async function postdiscordboats(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discord.boats/api/bot/484148705507934208";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.DISCORD_BOATS_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "server_count": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    async function postdiscordextremelist(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://api.discordextremelist.xyz/v2/bot/484148705507934208/stats";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.DEL_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "guildCount": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    async function postblistxyz(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://blist.xyz/api/v2/bot/484148705507934208/stats";
      let xhr = new XMLHttpRequest();
      xhr.open("PATCH", url);
      xhr.setRequestHeader("Authorization", process.env.BLIST_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "server_count": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    async function postbfd(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://botsfordiscord.com/api/bot/484148705507934208";
      let xhr = new XMLHttpRequest();
      xhr.open("PATCH", url);
      xhr.setRequestHeader("Authorization", process.env.BFD_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "server_count": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    async function postbbl(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://bladebotlist.xyz/api/bots/484148705507934208/stats";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.BBL_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "servercount": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
  }
}