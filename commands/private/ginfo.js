const Discord = require("discord.js");
module.exports = {
  aliases: ["g"],
  name: "ginfo",
  description: "Guild Info",
  emoji: "🔒",
  dev: true,
  run: async (bot, message, args, prefix) => {
    message.delete({ timeout: 500 }).catch(e => { });
    let id = args[0]
    if (args[1]) return;
    let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(id)
    if (!guildData) {
      if (bot.guilds.cache.has(id)) {
        bot.utils.registerGuild(bot, bot.guilds.cache.get(id))
        guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(id)
      } else {
        let noinfo = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(`${bot.emoji.cross} **I do not have data for that guild!**`)
        message.channel.send(noinfo)
        return;
      }
    }
    let guild = bot.guilds.cache.get(id);
    let guildname, guildid, bots, users, online, text, voice, owner, created, joined, guildicon;
    if (!guild) {
      bots = users = online = text = voice = owner = created = joined = "x"
      guildicon = "https://discordemoji.com/assets/emoji/x.png"
    } else {
      // let hasdsl;
      if (guild.members.cache.has("422087909634736160")) {
        var hasdsl = "true"
      } else {
        var hasdsl = "false"
      }
      // let hasdisboard;
      if (guild.members.cache.has("302050872383242240")) {
        var hasdisboard = "true"
      } else {
        var hasdisboard = "false"
      }
      if (guild.members.cache.has("476259371912003597")) {
        var discordme = "true"
      } else {
        var discordme = "false"
      }
      if (guild.members.cache.has("115385224119975941")) {
        var discordservers = "true"
      } else {
        var discordservers = "false"
      }
      guildname = guildData.guildname;
      guildid = guildData.guildid;
      bots = guild.members.cache.filter(c => c.user.bot).size;
      users = guild.members.cache.size - bots;
      online = guild.members.cache.filter(m => m.presence.status !== "offline").size;
      text = guild.channels.cache.filter(c => c.type === "text").size;
      voice = guild.channels.cache.filter(c => c.type === "voice").size;
      owner = guild.owner;
      created = guild.createdAt.toLocaleString().split("GMT")[0].trim()
      joined = guild.joinedAt.toLocaleString().split("GMT")[0].trim()
      guildicon = guild.iconURL()
    }
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${bot.user.username} - Guild Information`)
      .setDescription([`**Guild Name/ID:** ${guildname} \`(${guildid})\``,
        ``,
      `**👥 User/Bots/Online**: ${users}/${bots}/${online}`,
      `**💬 Text/Voice Channels:** ${text}/${voice}`,
      `**🌎 Language:** ${guildData.language}`,
      `**Prefix:** ${guildData.prefix}`,
        ``,
      `**DSL:** ${hasdsl}`,
      `**Disboard:** ${hasdisboard}`,
      `**Discord.Me:** ${discordme}`,
      `**DiscordServers:** ${discordservers}`,
        ``,
      `**Owner:** ${owner}`,
      `**Created:** ${created} GMT`,
      `**Joined:** ${joined} GMT`].join("\n"))
      .setThumbnail(guildicon)
      .setColor(bot.colors.main)
    message.channel.send(embed).catch(e => { })
    bot.hastebin(JSON.stringify(guildData, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
      message.channel.send(`**Full:** ${haste}`);
    }).catch(console.error)
    let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(id);
    let x = JSON.parse(usageData.usage)
    return bot.hastebin(JSON.stringify(x, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
      message.channel.send(`**Usage:** ${haste}`);
    }).catch(console.error)
  }
}