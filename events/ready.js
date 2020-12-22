const { MessageEmbed } = require("discord.js");
const { loadMain, loadMCServers, loadAutoVoiceChannels, loadRestrictedChannels, loadLFGNotificationChannels, loadLFGRoles, loadAntiPingUsers, loadAntiPingChannels, loadAntiPingRoles, loadDisabledCommands, loadMonthlyVotes, loadTotalVotes, loadVotedUsers, loadEmojis } = require("../utils/load")
module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`✅ Ready event loading... ${bot.user.tag}`)
    let guildChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get("652539034404519936");
    if (guildChannel) {
      let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let guildText = `📚 Guilds : ${guilds}`;
      if (guildChannel.name !== guildText) {
        guildChannel.setName(guildText).catch(e => { });
      }
    }
    // postdiscordbotlist();
    postdsicordboats(bot);
    setInterval(async () => {
      if (guildChannel) {
        let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
        let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
        let guildText = `📚 Guilds : ${guilds}`;
        if (guildChannel.name !== guildText) {
          guildChannel.setName(guildText).catch(e => { });
        }
      }
      // postdiscordbotlist();
      postdsicordboats(bot);
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
    bot.guilds.cache.forEach(guild => {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      if (!guildData) {
        bot.utils.registerGuild(bot, guild)
        guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      }
      bot.db.prepare("UPDATE guilddata SET ballcustomreplies=? WHERE guildid=?").run("[]", guild.id)
      let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(guild.id);
      if (!usageData) {
        bot.utils.registerGuildUsage(bot, guild)
        usageData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      }

      // bot.db.prepare("UPDATE guilddata SET duoname=? WHERE guildid=?").run("Duo {NUMBER}", guild.id)
      // bot.db.prepare("UPDATE guilddata SET trioname=? WHERE guildid=?").run("Trio {NUMBER}", guild.id)
      // bot.db.prepare("UPDATE guilddata SET squadname=? WHERE guildid=?").run("Squad {NUMBER}", guild.id)

      if (usageData.inguild === "false" || null) bot.db.prepare("UPDATE usagedata SET inguild=? WHERE guildid=?").run("true", guild.id);
      if (guildData.inguild === "false" || null) bot.db.prepare("UPDATE guilddata SET inguild=? WHERE guildid=?").run("true", guild.id);
      if (guildData.guildname !== guild.name) bot.db.prepare("UPDATE guilddata SET guildname=? WHERE guildid=?").run(guild.name, guild.id);
    });
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
    loadVotedUsers(bot);
    loadEmojis(bot);
    bot.announcements = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.announcements);
    bot.updates = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.updates);
    bot.status = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.status);
    let statusList = [
      { name: `on shard {SHARD}/{MAXSHARDS}`, type: "PLAYING" },
      { name: `with ${bot.shard.count} shards`, type: "PLAYING" },
      { name: `with 20+ languages`, type: "PLAYING" },
      { name: `with new updates`, type: "PLAYING" },
      { name: `with your mind`, type: "PLAYING" },
      { name: `with your friends`, type: "PLAYING" },
      { name: `with your thoughts`, type: "PLAYING" },
      { name: `for safe holidays`, type: "WATCHING" },
      { name: `for your attention`, type: "COMPETING" },
      { name: `by myself`, type: "PLAYING" },
      { name: `{SERVERS} cool servers`, type: "WATCHING" },
      { name: `{USERS} amazing users`, type: "WATCHING" },
      { name: `for @Magic8`, type: "WATCHING" },
      { name: `for @Magic8 help`, type: "WATCHING" },
      { name: `for @Magic8 settings`, type: "WATCHING" },
      { name: `for @Magic8 langs`, type: "WATCHING" },
      { name: `for @Magic8 updates`, type: "WATCHING" },
      { name: `for new updates`, type: "WATCHING" },
    ];
    bot.channels.cache.get("766108811978080267").messages.fetch().then(() => {
      bot.latestupdate.set("latestupdate", bot.channels.cache.get("766108811978080267").messages.cache.first().content);
    }).catch(e => { });
    let statusSize = statusList.length - 1;
    let maxshards = bot.shard.count;
    setInterval(async () => {
      let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      bot.shard.count.forEach(shard => {
        let status = statusList[statusSize];
        bot.user.setActivity(status.name.replace(/{SERVERS}/g, guilds).replace(/{USERS}/g, parseInt(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en").replace(/{SHARD}/g, shard).replace(/{MAXSHARDS}/g, maxshards)), { type: status.type }).catch(e => { });
        statusSize--;
        if (statusSize < 0) statusSize = statusList.length - 1;
      });
    }, 10000);
    bot.user.setStatus("online").catch(e => { });
    bot.utils.fetchLanguages(bot);
    setTimeout(() => {
      bot.utils.loadLanguageProgress(bot);
    }, 5000)
    let date = new Date().toLocaleString().split(" ");
    let time = `${date[1]}${date[2]}`;
    let restartTime = bot.ms(new Date() - bot.starttime);
    console.log(`✅ Start Time: ${restartTime}`);
    console.log(`🛰️ Ping: ${bot.ms(bot.ws.ping)}`);
    let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
    let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
    console.log(`📊 Users: ${parseInt(bot.users.cache.filter(u => !u.bot).size.toLocaleString("en"))} - Guilds: ${guilds}`);
    let readyMsg = `${bot.emoji.check} __${time}__ ${bot.user} **successfully restarted!** Time: \`${restartTime}\` Ping: \`${bot.ms(bot.ws.ping)}\``;
    bot.channels.cache.get(bot.config.commandlogs).send(readyMsg).catch(e => { });
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
      let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "guilds": ${guilds}
      }`;
      xhr.send(data);
    }
    async function postdsicordboats(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discord.boats/api/bot/484148705507934208";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.DISCORD_BOATS_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
      let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
      let data = `{
        "server_count": ${guilds}
      }`;
      xhr.send(data);
    }
  }
}