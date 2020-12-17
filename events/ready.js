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
    postdsicordboats(bot);
    setInterval(() => {
      if (guildChannel) {
        let guildText = `📚 Guilds : ${(bot.guilds.cache.size).toLocaleString("en")}`;
        if (guildChannel.name !== guildText) {
          guildChannel.setName(guildText);
        }
      }
      // postdiscordbotlist();
      postdsicordboats(bot);
    }, 1800000)
    let userStats = "652538780376367104";
    let userChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(userStats);
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
      { name: `with 20+ languuages`, type: "PLAYING" },
      { name: `with your mind`, type: "PLAYING" },
      { name: `with your thoughts`, type: "PLAYING" },
      { name: `by myself`, type: "PLAYING" },
      { name: `{SERVERS} cool servers`, type: "WATCHING" },
      { name: `{USERS} amazing users`, type: "WATCHING" },
      { name: `for @Magic8`, type: "WATCHING" },
      { name: `for @Magic8 help`, type: "WATCHING" },
      { name: `for @Magic8 settings`, type: "WATCHING" },
      { name: `for @Magic8 langs`, type: "WATCHING" },
      { name: `for new updates`, type: "WATCHING" },
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
    function postdsicordboats(bot) {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let url = "https://discord.boats/api/bot/484148705507934208";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", process.env.DISCORD_BOATS_API);
      xhr.setRequestHeader("Content-Type", "application/json");
      let data = `{
        "server_count": ${bot.guilds.cache.size}
      }`;
      xhr.send(data);
    }
  }
}