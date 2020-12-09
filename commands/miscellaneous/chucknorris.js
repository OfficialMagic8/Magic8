const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["norris", "cn"],
  category: "MISCELLANEOUS",
  emoji: "📦",
  description: "Chuck norris jokes!",
  name: "chucknorris",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    bot.fetch(`https://api.chucknorris.io/jokes/random/`).then(res => res.json()).then(json => {
      let embed = new MessageEmbed()
        .setDescription(`${bot.emoji.check} **${json.value}**`)
        .setThumbnail(json.icon_url)
        .setColor(bot.colors.blue)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }).catch(e => { bot.error(bot, message, language, e); });

  }
}