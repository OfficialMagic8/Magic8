const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["daily"],
  category: "INFORMATION",
  description: "View Magic8's daily summary of statistics.",
  emoji: "📰",
  name: "summary",
  dev: true,
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let date = new Date().toLocaleString("en").split(" ")[0].replace(/\,/g, "")
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "summary.loading")
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{USER}/g, message.author))
    let embedmessage = await message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    bot.fetch("https://api.statcord.com/v3/484148705507934208?days=2").then(res => res.json()).then(json => {
      let today = json.data[1];
      let yesterday = json.data[0];
      let todayscommands = parseInt(today.commands);
      let todaysdiffcommands = todayscommands - parseInt(yesterday.commands);
      let todaysguilds = parseInt(today.servers);
      let todaysdiffguilds = todaysguilds - parseInt(yesterday.guilds)
      let todaysactiveusers = parseInt(today.active)
      let todaysactiveusersdiff = todaysactiveusers - parseInt(yesterday.active)
      embed.setAuthor(bot.translate(bot, language, "summary.title")
        .replace(/{BOTNAME}/g, bot.user.username)
        .replcae(/{DATE}/g, date))
      embed.setColor(bot.colors.main)
      embed.setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      embed.setDescription(bot.translate(bot, language, "summary.description").join("\n")
        .replace(/{TOTALGUILDS}/g, bot.guilds.cache.size)
        .replace(/{GUILDSDIFF}/g, todaysdiffguilds)
        .replace(/{COMMANDSUSED}/g, todayscommands)
        .replace(/{COMMANDSUSEDDIFF}/g, todaysdiffcommands)
        .replace(/{ACTIVEUSERS}/g, todaysactiveusers)
        .replace(/{ACTIVEUSERSDIFF}/g, todaysactiveusersdiff)
        .replace(/{INFO}/g, bot.emoji.info)
        .replace(/{STATCORD}/g, "https://statcord.com/bot/484148705507934208"));
      return embedmessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
    }).catch(e => { return bot.error(bot, message, language, e); });
  }
}