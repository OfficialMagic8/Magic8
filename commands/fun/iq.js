const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["myiq"],
  category: "FUN",
  description: "Check the IQ of yourself or a friend",
  emoji: "🧠",
  name: "iq",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g, "");
      try {
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    }
    if (!target) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let useriq = Math.floor(Math.random() * 121) + 40;
    let finalmsg;
    if (useriq < 60) {
      let superdumb = bot.translate(bot, language, "iq.superdumb");
      finalmsg = superdumb[Math.floor(Math.random() * superdumb.length)];
    } else if (useriq < 85) {
      let dumb = bot.translate(bot, language, "iq.dumb");
      finalmsg = dumb[Math.floor(Math.random() * dumb.length)];
    } else if (useriq > 115) {
      let smart = bot.translate(bot, language, "iq.smart");
      finalmsg = smart[Math.floor(Math.random() * smart.length)];
    } else if (useriq > 140) {
      let genius = bot.translate(bot, language, "iq.genius");
      finalmsg = genius[Math.floor(Math.random() * genius.length)];
    } else {
      let average = bot.translate(bot, language, "iq.average");
      finalmsg = average[Math.floor(Math.random() * average.length)];
    }
    let embed = new MessageEmbed()
      .setColor(guildData.funcolor)
      .setThumbnail("https://cdn.discordapp.com/attachments/633725136163438592/709593616221339710/7b48zLprDHLzsc27xkCCKLI8w4T_8zokG-A4dVKvh2NBPXk_3Xto6R6TdEGFHV-0UHA.png")
      .setDescription(bot.translate(bot, language, "iq.description").join("\n")
        .replace(/{TARGET}/g, target)
        .replace(/{IQ}/g, useriq)
        .replace(/{MESSAGE}/g, finalmsg));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}