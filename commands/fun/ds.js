const { MessageEmbed } = require("discord.js");
const requestpromise = require("request-promise");
module.exports = {
  aliases: ["ds", "penissize", "ps"],
  category: "FUN",
  description: "Measure either yours or a friend's penis size.",
  emoji: "🍆",
  name: "dicksize",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.member;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g, "");
      try {
        target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let size = Math.floor(Math.random() * 25) / 2
    let ripmessagelol;
    let who = target.id === message.author.id ? "self" : "other";
    if (size > 8) {
      let b = bot.translate(bot, language, `dicksize.${who}.big`)
      ripmessagelol = b[Math.floor(Math.random() * b.length)];
    } else if (size < 4) {
      let s = bot.translate(bot, language, `dicksize.${who}.small`)
      ripmessagelol = s[Math.floor(Math.random() * s.length)];
    } else {
      let m = bot.translate(bot, language, `dicksize.${who}.med`)
      ripmessagelol = m[Math.floor(Math.random() * m.length)];
    }
    let embed = new MessageEmbed()
      .setColor(guildData.funcolor)
      .setThumbnail("https://i.ya-webdesign.com/images/drawing-rulers-12-inch-6.png")
      .setDescription(bot.translate(bot, language, `dicksize.${who}.description`).join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{SIZE}/g, size)
        .replace(/{MESSAGE}/g, ripmessagelol)
        .replace(/{TARGET}/g, target.user));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}