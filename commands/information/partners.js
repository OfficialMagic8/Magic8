const { MessageEmbed } = require("discord.js");
const partners = [
  `[{BREMEA} **BreMea**](https://docs.magic8.xyz/info/partners/bremea)`,
  `[{PLEXUSMC} **PlexusMC**](https://docs.magic8.xyz/info/partners/plexusmc)`,
  `[{SHOPERY} **Shopery**](https://docs.magic8.xyz/info/partners/shopery)`,
  `[{SOMETHINGHOST} **Something.Host**](https://docs.magic8.xyz/info/partners/somethinghost)`
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
      .setDescription(partners.join("\n")
        .replace(/{BREMEA}/g, bot.emoji.bremea)
        .replace(/{PLEXUSMC}/g, bot.emoji.plexusmc)
        .replace(/{SHOPERY}/g, bot.emoji.shopery)
        .replace(/{SOMETHINGHOST}/g, bot.emoji.somethinghost));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}