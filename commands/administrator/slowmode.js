const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["sm"],
  category: "ADMINISTRATOR",
  description: "Set a custom slowmode for any channel, you can't do this in regular channel settings!\nRequires `Manage Server` Permission",
  emoji: "⏱️",
  name: "slowmode",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "slowmode.menutitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setDescription(bot.translate(bot, language, "slowmode.menu").join("\n")
          .replace(/{BOT}/g, bot.emoji.cross)
          .replace(/{CHANNEL}/g, message.channel)
          .replace(/{TIME}/g, message.channel.rateLimitPerUser)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (isNaN(args[0])) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "slowmode.notanumber")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{CHANNEL}/g, message.channel));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let time = Math.abs(Math.floor(parseInt(args[0])))
    if (time > 21600) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "slowmode.toolarge")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    return message.channel.edit({ rateLimitPerUser: time }).then(c => {
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "slowmode.set").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{CHANNEL}/g, message.channel)
          .replace(/{TIME}/g, time)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
    }).catch(e => { return bot.error(bot, message, language, e); });
  }
}