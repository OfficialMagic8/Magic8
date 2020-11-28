const Discord = require("discord.js");
module.exports = {
  aliases: ["spoil"],
  category: "MISCELLANEOUS",
  description: "Turn a message into a spoiler",
  emoji: "⬛",
  name: "spoiler",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let msg = args.join(" ");
    if (!msg) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "spoiler.messagerequired")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { });
    }
    try {
      let spoiler = await bot.nekos.sfw.spoiler({ text: msg })
      let spoiled = new Discord.MessageEmbed()
        .setColor(bot.colors.blue)
        .setDescription(`${bot.emoji.check} **${message.author.username}: ${spoiler.owo}**`);
      message.channel.send(spoiled).catch(e => { });
    } catch (e) {
      console.error(e);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "unexpectederror")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{INVITE}/g, bot.invite));
      return message.channel.send(embed).catch(e => { });
    }
  }
}  