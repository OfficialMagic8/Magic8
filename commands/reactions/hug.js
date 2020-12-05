const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "REACTIONS",
  description: "Hug someone!",
  emoji: "🤗",
  name: "hug",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    }
    let link = bot.links.hug[Math.floor(Math.random() * bot.links.hug.length)];
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(link)
      .setDescription(bot.translate(bot, language, `hug.${target.id === message.author.id ? "self" : "other"}`)
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{TARGET}/g, target.uesr));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}  