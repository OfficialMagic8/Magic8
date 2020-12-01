const Discord = require("discord.js")
module.exports = {
  aliases: ["bal", "coins", "money"],
  description: "Check your Casino balance",
  emoji: "💰",
  name: "balance",
  beta: true,
  toggleable: true,
  dev: true,
  category: "CASINO",
  run: async (bot, message, args, prefix, guildData) => {
    if (bot.playingcasino.has(message.author.id)) {
      let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
      let balEmbed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription([`\\💰 ${message.author}`,
        `**Coins:** ${(userData.coins).toLocaleString("en")}`,
        `**Multiplier:** ${userData.multiplier}`,
        `**Total:** ${((userData.multiplier * userData.coins)).toLocaleString("en")}`,
        `**Stealing Risk:** ${userData.stealingrisk}%`].join("\n"))
      return message.channel.send(balEmbed).catch(e => { })
    }
  }
}