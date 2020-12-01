const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["howhomo", "hg"],
  category: "FUN",
  description: "Show how gay is someone",
  emoji: "🌈",
  name: "howgay",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.member;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let embed = new MessageEmbed()
      .setColor(guildData.funcolor)
      .setDescription(bot.translate(bot, language, "howgay.success")
        .replace(/{TARGET}/g, target.user)
        .replace(/{PERCENT}/g, Math.floor(Math.random() * 101))
        .replace(/{CHECK}/g, bot.emoji.check))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}