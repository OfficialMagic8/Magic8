const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["dbg"],
  name: "debug",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (bot.debug === true) {
      bot.debug = false;
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **DEBUG DISABLED**`);
      return message.channel.send(embed).catch(e => { });
    } else if (bot.debug === false) {
      bot.debug = true;
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(`${bot.emoji.check} **DEBUG ENABLED**`);
      return message.channel.send(embed).catch(e => { });
    }
  }
}