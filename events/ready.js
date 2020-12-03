const { MessageEmbed } = require("discord.js");
const { loadMain, loadMCServers, loadAutoVoiceChannels, loadRestrictedChannels, loadLFGNotificationChannels, loadLFGRoles, loadAntiPingUsers, loadAntiPingChannels, loadAntiPingRoles, loadDisabledCommands, loadMonthlyVotes, loadTotalVotes, loadVotedUsers, loadEmojis } = require("../utils/load")
module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`✅ Ready event loading... ${bot.user.tag}`)
    bot.statcord.autopost();
    let guildStats = "652539034404519936";
    let guildChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(guildStats);
    if (guildChannel) {
      let guildText = `📚 Guilds : ${(bot.guilds.cache.size).toLocaleString("en")}`;
      if (guildChannel.name !== guildText) {
        guildChannel.setName(guildText);
      }
    }
    // postdiscordbotlist();
    setInterval(() => {
      if (guildChannel) {
        let guildText = `📚 Guilds : ${(bot.guilds.cache.size).toLocaleString("en")}`;
        if (guildChannel.name !== guildText) {
          guildChannel.setName(guildText);
        }
      }
      // postdiscordbotlist();
    }, 1800000)
    let userStats = "652538780376367104";
    let userChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(userStats);
    if (userChannel) {
      let userText = `👥 Users : ${(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")}`;
      if (userChannel.name !== userText) {
        userChannel.setName(userText);
      }
    }
    setInterval(() => {
      if (userChannel) {
        let userText = `👥 Users : ${(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")}`;
        if (userChannel.name !== userText) {
          userChannel.setName(userText);
        }
      }
    }, 1800000)
    let monthlyVotesStats = "706888493145653339";
    bot.dbl.getBot(bot.user.id).then(botinfo => {
      let votesText = `📆 Monthly Votes: ${botinfo.monthlyPoints}`;
      let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(monthlyVotesStats);
      if (votesChannel) {
        if (votesChannel.name !== votesText) {
          votesChannel.setName(votesText);
        }
      }
    }).catch(e => { });
    let totalVotesStats = "701902456052776960";
    bot.dbl.getBot(bot.user.id).then(botinfo => {
      let votesText = `💎 Total Votes: ${botinfo.points}`;
      let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(totalVotesStats);
      if (votesChannel) {
        if (votesChannel.name !== votesText) {
          votesChannel.setName(votesText);
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
            votesChannel.setName(votesText);
          }
        }
      }).catch(e => { });
      let totalVotesStats = "701902456052776960";
      bot.dbl.getBot("484148705507934208").then(botinfo => {
        let votesText = `💎 Total Votes: ${botinfo.points}`;
        let votesChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(totalVotesStats);
        if (votesChannel) {
          if (votesChannel.name !== votesText) {
            votesChannel.setName(votesText);
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
      // let usage = JSON.parse(usageData.usage)
      // if (!usage.find(command => command.name === "language")) {
      //   let o = {
      //     command: "language",
      //     usage: 0
      //   }
      //   usage.push(o)
      //   bot.udb.prepare("UPDATE usagedata SET usage=? WHERE guildid=?").run(JSON.stringify(usage), guild.id)
      // }
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
    bot.users.fetch(bot.developerid).then(u => {
      bot.developer = u;
    });
    bot.users.fetch(bot.maindeveloperid).then(u => {
      bot.maindeveloper = u;
    });
    bot.announcements = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.announcements);
    bot.updates = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.updates);
    bot.status = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.status);
    let statusList = [
      { name: `new multiple language support!`, type: "PLAYING" },
      { name: `with your mind | m!help`, type: "PLAYING" },
      { name: `{SERVERS} servers | m!help`, type: "WATCHING" },
      { name: `{USERS} users | m!help`, type: "WATCHING" },
      { name: `for @Magic8`, type: "WATCHING" }
    ];
    let statusSize = statusList.length - 1;
    setInterval(() => {
      let status = statusList[statusSize];
      bot.user.setActivity(status.name.replace(/{SERVERS}/g, parseInt(bot.guilds.cache.size).toLocaleString("en")).replace(/{USERS}/g, parseInt(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")), { type: status.type });
      statusSize--;
      if (statusSize < 0) statusSize = statusList.length - 1;
    }, 10000);
    bot.user.setStatus("online")
    bot.utils.fetchLanguages(bot);
    setTimeout(() => {
      bot.utils.loadLanguageProgress(bot);
    }, 5000)
    let date = new Date().toLocaleString().split(" ");
    let time = `${date[1]}${date[2]}`;
    let restartTime = bot.ms(new Date() - bot.starttime);
    console.log(`✅ Start Time: ${restartTime}`);
    console.log(`🛰️ Ping: ${bot.ms(bot.ws.ping)}`);
    console.log(`📊 Users: ${(bot.users.cache.filter(u => !u.bot).size).toLocaleString("en")} - Guilds: ${(bot.guilds.cache.size).toLocaleString("en")}`);
    let readyMsg = `${bot.emoji.check} __${time}__ ${bot.user} **successfully restarted!** Time: \`${restartTime}\` Ping: \`${bot.ms(bot.ws.ping)}\``;
    bot.channels.cache.get(bot.config.commandlogs).send(readyMsg).catch(e => { });
    function postdiscordbotlist() {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discordbotlist.com/api/v1/bots/484148705507934208/stats";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.BOT_LIST_TOKEN);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log(xhr.status);
          // console.log(xhr.responseText);
        }
      };
      let data = `{
        "guilds": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
    function postdsicordboats() {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discord.boats/api/bot/484148705507934208";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", DISCORD_BOATS_AUTH);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log(xhr.status);
          // console.log(xhr.responseText);
        }
      };
      let data = `{
        "server_count": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
  }
}