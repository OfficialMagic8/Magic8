const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "INFO",
  description: "View Magic8's most popular commands from Statcord",
  emoji: "📈",
  name: "popular",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let popularcommands = await bot.fetch("https://statcord.com/logan/stats/484148705507934208").then(res => res.json())
      .then(json => {
        return json.popular;
      }).catch(e => { return bot.error(bot, message, language, e); });
    let popularcommandsarray = [];
    for (command of popularcommands) {
      if (popularcommands.indexOf(command) < 10) {
        popularcommandsarray.push(`**-** \`${command.name}\` (${parseInt(command.count).toLocaleString("en")})`);
      }
    }
    let embed = new Discord.MessageEmbed()
      .setAuthor(bot.translate(bot, language, "popular.title")
        .replace(/{BOTNAME}/g, bot.user.username))
      .setColor(bot.colors.main)
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      .setDescription(bot.translate(bot, language, "popular.description").join("\n")
        .replace(/{COMMANDS}/g, popularcommandsarray.join("\n")));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}  