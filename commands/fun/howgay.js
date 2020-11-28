const Discord = require("discord.js");
module.exports = {
  aliases: ["howhomo", "hg"],
  category: "FUN",
  description: "Show how gay is someone",
  emoji: "🌈",
  name: "howgay",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let error = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(error).catch(e => { });
      }
    }
    let howgay = new Discord.MessageEmbed()
      .setColor(guildData.funcolor)
      .setDescription(bot.translate(bot, language, "howgay.success")
        .replace(/{TARGET}/g, target)
        .replace(/{PERCENT}/g, Math.floor(Math.random() * 101))
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, target))
    return message.channel.send(howgay).catch(e => { });
  }
}