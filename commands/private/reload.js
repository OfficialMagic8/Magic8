const Discord = require("discord.js");
const { loadCommands } = require("./utils/methods")
module.exports = {
  aliases: [],
  category: "",
  description: "Reload a load commands",
  emoji: "🔄",
  name: "reload",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(`${bot.emoji.loading} **${message.author}, I am reloading all comands!**`);
    let embedmessage;
    try {
      embedmessage = await message.channel.send(embed);
    } catch (e) {
      return bot.error(bot, message, language, e);
    }
    try {
      loadCommands(bot);
      setTimeout(() => {
        embed.setColor(bot.colors.green);
        embed.setDescription(`${bot.emoji.check} **${message.author}, commands were reloaded successfully.**`)
      }, 3000);
    } catch (e) {
      embed.setColor(bot.colors.red);
      embed.setDescription(`${bot.emoji.cross} **${message.author}, there was an error reloading the commands! Check console!**`);
      embedmessage.edit(embed);
      let error = [
        `\`\`\``,
        `${e}`,
        `\`\`\``
      ];
      return message.channel.send(error).catch(e => { })
    }
  }
}  