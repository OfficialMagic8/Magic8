const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["yomama", "yomamma"],
  category: "MISCELLANEOUS",
  description: "Get the best yomomma jokes ever",
  emoji: "📦",
  name: "yomomma",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    bot.fetch(`https://api.yomomma.info/`).then(res => res.json()).then(json => {
      let embed = new MessageEmbed()
        .setColor(bot.colors.blue)
        .setThumbnail("http://clipart-library.com/image_gallery/309987.png")
        .setDescription(`${bot.emoji.check} **${json.joke}**`);
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }).catch(e => { return bot.error(bot, message, language, e); })
  }
}