const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "USER",
  description: "Show users avatar",
  emoji: "👤",
  name: "avatar",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g, "");
      try {
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "avatar.success")
        .replace(/{URL}/g, target.displayAvatarURL({ format: "png", size: 1024, dynamic: true }))
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, target))
      .setImage(target.displayAvatarURL({ format: "png", size: 1024, dynamic: true }))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}