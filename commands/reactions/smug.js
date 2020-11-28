const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "REACTIONS",
  description: "Smug someone!",
  emoji: "👉🏻",
  name: "smug",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    message.delete({ timeout: 500 }).catch(e => { });
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g, "");
      try {
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    }
    let link = bot.links.smug[Math.floor(Math.random() * bot.links.smug.length)];
    let embed = new Discord.MessageEmbed()
      .setDescription(bot.translate(bot, language, `smug.${target.id === message.author.id ? "self" : "other"}`)
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{TARGET}/g, target))
      .setColor("RANDOM")
      .setImage(link);
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}  