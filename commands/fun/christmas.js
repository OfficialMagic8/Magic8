const Discord = require("discord.js");
module.exports = {
  aliases: ["xmas"],
  category: "FUN",
  description: "A little Christmas message that is available year-round",
  emoji: "🎄",
  name: "christmas",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    let data = await bot.fetch("https://christmas-days.anvil.app/_/api/get_days").then(res => res.json())
      .then(json => {
        return json;
      }).catch(e => bot.error(bot, message, language, e))
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.green)
      .setThumbnail("https://i.imgur.com/ACaHu30.png")
      .setDescription(bot.translate(bot, language, "christmas.description").join("\n")
        .replace(/{DAYS}/g, data["Days to Christmas"]))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}  