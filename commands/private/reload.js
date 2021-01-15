const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  name: "reload",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    try {
      delete require.cache[require.resolve("../../utils/methods.js")];
      bot.utils = require("../../utils/methods.js");

      delete require.cache[require.resolve("../../utils/webhooks.js")];
      bot.webhooks = require("../../utils/webhooks.js");

      delete require.cache[require.resolve("../../utils/ads.json")];
      bot.ads = require("../../utils/ads.json");

      delete require.cache[require.resolve("../../config.json")];
      bot.config = require("../../config.json");

      delete require.cache[require.resolve("../../utils/emojis.json")];
      bot.emoji = require("../../utils/emojis.json");
      
      bot.utils.loadDatabases(bot);
      bot.utils.loadCommands(bot);
      bot.utils.loadEvents(bot);
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
          `\`\`\``]);
      return message.channel.send(embed).catch(e => { });
    }
  }
}  