const { MessageEmbed } = require("discord.js");
const partners = [
  `[${bot.emoji.bremea} **BreMea**](https://docs.magic8.xyz/info/partners/bremea)`,
  `[${bot.emoji.plexusmc} **PlexusMC**](https://docs.magic8.xyz/info/partners/plexusmc)`,
  `[${bot.emoji.shopery} **Shopery**](https://docs.magic8.xyz/info/partners/shopery)`,
  `[${bot.emoji.somethinghost} **Something.Host**](https://docs.magic8.xyz/info/partners/somethinghost)`
]
module.exports = {
  aliases: [],
  category: "INFORMATION",
  description: "Magic8's amazing partners that offer great services or products.",
  emoji: "🤝",
  name: "partners",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setAuthor(`${bot.user.username} Partners`)
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      .setDescription(partners.join("\n"));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}