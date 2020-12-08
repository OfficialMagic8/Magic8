const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["donate", "p", "upgrade"],
  description: "Magic8 Donation/Premium Page - We work hard to make Magic8 work well for you :)",
  emoji: "💸",
  name: "premium",
  category: "INFO",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "premium.title"))
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "premium.description").join("\n")
        .replace(/{DONATIONLINK}/g, bot.config.donatelink));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}