const Discord = require("discord.js");
const link = "https://minecraftskinstealer.com/achievement/{ITEM}/{TITLE}/{SUBTITLE}"
module.exports = {
  aliases: ["mcachie", "mca"],
  category: "MINECRAFT",
  description: "Create your own Minecraft achivement",
  emoji: "🎮",
  name: "mcachievement",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    // message.delete({timeout:500}).catch(e=>{});
    let language = bot.utils.getLanguage(bot, guildData.language);
    let title;
    let subtitle;
    if (args[0]) {
      let parts = args.join(" ").replace(/(\\|\/)/g, " ").trim().split("|");
      let ptitle = parts[0] ? parts[0].trim() : parts[0]
      let psubtitle = parts[1] ? parts[1].trim() : parts[1]
      if (ptitle && ptitle.length >= 1) {
        title = ptitle;
      } else {
        title = bot.translate(bot, language, "mcachievement.defaulttitle")
      }
      title = title.split(" ").join("%20")
      if (psubtitle && psubtitle.length >= 1) {
        subtitle = psubtitle;
      } else {
        subtitle = bot.translate(bot, language, "mcachievement.defaultsubtitle")
      }
      subtitle = subtitle.split(" ").join("%20")
    } else {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "mcachievement.usage").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{PREFIX}/g, prefix))
        .setImage("https://i.imgur.com/xQPByzh.png")
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let item = Math.floor(Math.random() * 150) + 1
    let finallink = link.replace(/{ITEM}/g, item)
      .replace(/{TITLE}/g, title)
      .replace(/{SUBTITLE}/g, subtitle);
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.lightblue)
      .setDescription(bot.translate(bot, language, "mcachievement.success").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author))
      .setImage(finallink)
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}