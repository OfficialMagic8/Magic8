const { MessageEmbed } = require("discord.js");
const partners = [
  `[{BREMEA} **BreMea Development**](https://docs.magic8.xyz/info/partners/bremea)`,
  `[{PLEXUSMC} **PlexusMC**](https://docs.magic8.xyz/info/partners/plexusmc)`,
  `[{SHOPERY} **Shopery**](https://docs.magic8.xyz/info/partners/shopery)`,
  `[{SOMETHINGHOST} **Something.Host**](https://docs.magic8.xyz/info/partners/somethinghost)`
]
module.exports = {
  aliases: ["affiliates"],
  category: "INFORMATION",
  description: "Magic8's amazing partners that offer great services or products.",
  emoji: "🤝",
  name: "partners",
  run: async (bot, message, args, prefix, guildData) => {
    let validids = [];
    bot.ads.forEach(ad => {
      if (ad.id) validids.push(ad.id);
    });
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(`${bot.user.username} Partners & Affiliates`)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(partners.join("\n")
          .replace(/{BREMEA}/g, bot.emoji.bremea)
          .replace(/{PLEXUSMC}/g, bot.emoji.plexusmc)
          .replace(/{SHOPERY}/g, bot.emoji.shopery)
          .replace(/{SOMETHINGHOST}/g, bot.emoji.somethinghost));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      if (!validids.includes(args[0].toLowerCase())) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "partners.invalid").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[0])
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else {
        let ad = bot.ads.find(ad => ad.id === args[0].toLowerCase());
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setTitle(`${ad.name} - ${ad.type}`)
          .setFooter(`Want you to be an partner or affiliate? Contact Fyrlex#2740`)
          .setDescription(ad.description.join("\n")
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{ADSINFO}/g, bot.docs.ads));
        if (ad.image) embed.setImage(ad.image);
        if (ad.thumbnail) embed.setThumbnail(ad.thumbnail);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
  }
}