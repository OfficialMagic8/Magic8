const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["cm"],
  category: "ENTERTAINMENT",
  description: "Clap in between a phrase",
  emoji: "👏",
  name: "clapme",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      let error = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "clapme.nomessage")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(error).catch(e => { });
    }
    let msg = args.filter(arg => arg.length >= 1).join(" 👏 ")
      .replace(/@everyone/gi, "<everyone>")
      .replace(/@here/gi, "<here>")
    let clapme = new MessageEmbed()
      .setDescription(bot.translate(bot, language, "clapme.success")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{MESSAGE}/g, msg))
      .setColor(guildData.funcolor)
    return message.channel.send(clapme).catch(e => { });
  }
}  