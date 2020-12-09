const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["xmas"],
  category: "MISCELLANEOUS",
  description: "A little Christmas message that is available year-round",
  emoji: "🎄",
  name: "christmas",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    bot.fetch("https://christmas-days.anvil.app/_/api/get_days").then(res => res.json())
      .then(json => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setThumbnail("https://i.imgur.com/ACaHu30.png")
          .setDescription(bot.translate(bot, language, "christmas.description").join("\n")
            .replace(/{DAYS}/g, json["Days to Christmas"]))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
  }
}  