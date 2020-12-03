const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "INFO",
  description: "View Magic8's most popular commands from Statcord",
  emoji: "📈",
  name: "popular",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "popular.loading")
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{USER}/g, message.author));
    let embedmessage = await message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    bot.fetch("https://statcord.com/logan/stats/484148705507934208").then(res => res.json()).then(json => {
      let popularcommands = json.popular;
      let popularcommandsarray = [];
      for (command of popularcommands) {
        let cmd = bot.commands.get(command.name);
        if (popularcommands.indexOf(command) < 10) {
          popularcommandsarray.push(`${cmd.emoji} \`${cmd.name}\` (${parseInt(command.count).toLocaleString("en")})`);
        }
      }
      embed.setAuthor(bot.translate(bot, language, "popular.title")
        .replace(/{BOTNAME}/g, bot.user.username))
      embed.setColor(bot.colors.main)
      embed.setFooter(bot.translate(bot, language, "popular.footer"))
      embed.setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      embed.setDescription(bot.translate(bot, language, "popular.description").join("\n")
        .replace(/{COMMANDS}/g, popularcommandsarray.join("\n")));
      return embedmessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
    }).catch(e => { return bot.error(bot, message, language, e); })
  }
}  