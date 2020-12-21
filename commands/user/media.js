const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["urls", "links", "website"],
  category: "USER",
  description: "View Media Page - Manage Media in Server Settings",
  emoji: "🌐",
  name: "media",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let mediatext = guildData.mediatext;
    if (mediatext !== "none") {
      let image
      if (guildData.mediaimage === "none") {
        image = ""
        // message.guild.iconURL({format:"png",dynamic:true})
      } else {
        image = guildData.mediaimage
      }
      let color
      if (guildData.mediacolor === "none") {
        color = ""
      } else {
        color = guildData.mediacolor
      }
      let mediaEmbed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
        .setImage(image)
        .setAuthor(bot.translate(bot, language, "media.title")
          .replace(/{GUILDNAME}/g, message.guild.name))
        .setColor(color)
        .setDescription(mediatext)
      return message.channel.send(mediaEmbed).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      if (!message.member.hasPermission("MANAGE_GUILD")) return;
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "media.nomedia").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}