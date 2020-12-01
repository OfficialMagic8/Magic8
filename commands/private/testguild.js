const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["tg"],
  name: "testguild",
  emoji: "🔒",
  dev: true,
  run: async (bot, message, args) => {
    bot.emit("guildDelete", message.guild)
    setTimeout(() => {
      bot.emit("guildCreate", message.guild)
    }, 5000);
  }
}