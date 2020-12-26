const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["rn"],
  category: "UTILITIES",
  description: "Randomize any range of numbers you'd like. If one number is provided, the minimum number is zero.",
  emoji: "🔢",
  name: "randomnumber",
  dev: true,
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "randomnumber.nonumbers")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let number = parseInt(args[0]);
    if (!Number.isInteger(number)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "randomnumber.notanumber").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (Number.isInteger(number)) {
      let random = Math.floor(Math.random() * (number + 1));
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "randomnumber.onenumber").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{MAXNUMBER}/g, args[0])
          .replace(/{RANDOMNUMBER}/g, random));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (Number.isInteger(number) && Number.isInteger(parseInt(args[1]))) {
      let random = Math.floor(Math.random() * (max + 1 - min) + min);
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "randomnumber.twonumbers").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{MINNUMBER}/g, args[0])
          .replace(/{MAXNUMBER}/g, args[1])
          .replace(/{RANDOMNUMBER}/g, random));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}