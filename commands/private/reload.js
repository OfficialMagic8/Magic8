const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "",
  description: "Reload a load commands",
  emoji: "🔄",
  name: "reload",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    try {
      bot.reload(bot);
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(`${bot.emoji.check} **${bot.user} was attempted to reload!**`);
      return message.channel.send(embed).catch(e => { });
    } catch (e) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription([
          `${bot.emoji.cross} **Error**`,
          `\`\`\`xl`,
          `${e}`,
          `\`\`\``])
      return message.channel.send(embed).catch(e => { })
    }
  }
}  