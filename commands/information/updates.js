const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["changelog", "cl"],
  category: "INFORMATION",
  description: "Get the most recent update on Magic8",
  emoji: "",
  name: "",
  dev: true,
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    return message.channel.send(bot.latestupdate.get("latestupdate")).catch(e => { return bot.error(bot, message, language, e); });
  }
}