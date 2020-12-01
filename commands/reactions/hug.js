const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "REACTIONS",
  description: "Hug someone!",
  emoji: "🤗",
  name: "hug",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    message.delete({ timeout: 500 }).catch(e => { });
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.author;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
      } catch (e) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    }
    let link = bot.links.hug[Math.floor(Math.random() * bot.links.hug.length)];
    let embed = new Discord.MessageEmbed()
      .setDescription(bot.translate(bot, language, `hug.${target.id === message.author.id ? "self" : "other"}`)
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{TARGET}/g, target))
      .setColor("RANDOM")
      .setImage(link)
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}  