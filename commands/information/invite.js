const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["inv"],
  category: "INFORMATION",
  description: "Invite Magic8 to your server.",
  emoji: "❕",
  name: "invite",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "invite.title")
        .replace(/{BOTNAME}/g, bot.user.username))
      .setDescription(bot.translate(bot, language, "invite.description").join("\n")
        .replace(/{AUTHOR}/g, message.author)
        .replace(/{MAGIC8}/g, bot.emoji.magic8)
        .replace(/{INVITE}/g, bot.config.botinvite)
        .replace(/{BOT}/g, bot.user))
      .setColor(bot.colors.main)
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}