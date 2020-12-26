const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  name: "voice",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (args[0]) {
      let channel = bot.channels.cache.get(args[0]);
      channel.join().catch(e => { });
    } else {
      let channel = bot.channels.cache.get("782370163793199134");
      channel.join().catch(e => { });
    }
  }
}