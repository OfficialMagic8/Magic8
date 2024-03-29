const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ad",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let ad = bot.ads[bot.adtype.get(message.guild.id)];
    if (!ad) bot.adtype.set(message.guild.id, 0);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setTitle(`${ad.name} - Advertisement`)
      .setFooter(`Want your Advertisement here? Contact Fyrlex#2740`)
      .setDescription(ad.description.join("\n")
        .replace(/{BOT}/g, bot.user)
        .replace(/{INVITE}/g, bot.invite)
        .replace(/{ADSINFO}/g, bot.docs.ads)
        .replace(/{INFO}/g, bot.emoji.info));
    if (ad.image) embed.setImage(ad.image);
    if (ad.thumbnail) embed.setThumbnail(ad.thumbnail);
    message.channel.send(embed).catch(e => { });
    bot.adtype.set(message.guild.id, (bot.adtype.get(message.guild.id) + 1));
    if (bot.adtype.get(message.guild.id) > 4) {
      bot.adtype.set(message.guild.id, 0);
    }
  }
}