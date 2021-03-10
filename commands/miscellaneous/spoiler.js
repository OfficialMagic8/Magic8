const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["spoil"],
  category: "MISCELLANEOUS",
  description: "Turn a message into a spoiler",
  emoji: "⬛",
  name: "spoiler",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let msg = args.join(" ");
    if (!msg) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "spoiler.messagerequired")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    try {
      let spoiler = await bot.nekos.sfw.spoiler({ text: msg })
      let spoiled = new MessageEmbed()
        .setColor(bot.colors.blue)
        .setDescription(`${bot.emoji.check} **${message.author.username}: ${spoiler.owo}**`);
      return message.channel.send(spoiled).catch(e => { return bot.error(bot, message, language, e); });
    } catch (e) { return bot.error(bot, message, language, e); }
  }
}  