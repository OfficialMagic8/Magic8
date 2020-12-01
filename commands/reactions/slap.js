const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "REACTIONS",
  description: "Slap someone!",
  emoji: "👋",
  name: "slap",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target = message.member;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let link = bot.links.slap[Math.floor(Math.random() * bot.links.slap.length)];
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(link)
      .setDescription(bot.translate(bot, language, `slap.${target.id === message.author.id ? "self" : "other"}`)
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{TARGET}/g, target.user));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}  