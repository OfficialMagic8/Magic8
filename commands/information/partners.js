const { MessageEmbed } = require("discord.js");
const partners = [
  "[**BreMea**](https://docs.magic8.xyz/info/partners/bremea)",
  "[**PlexusMC**](https://docs.magic8.xyz/info/partners/plexusmc)",
  "[**Shopery**](https://docs.magic8.xyz/info/partners/shopery)",
  "[**Something.Host**](https://docs.magic8.xyz/info/partners/somethinghost)"
]
module.exports = {
  aliases: [],
  category: "INFORMATION",
  description: "View Magic8's amazing partners.",
  emoji: "🤝",
  name: "partners",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setAuthor(`${bot.user.username} Partners`)
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      .setDescription(partners.map(p => `**•** ${p}`).join("\n"));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}