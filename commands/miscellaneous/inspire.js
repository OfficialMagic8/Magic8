const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "MISCELLANEOUS",
  description: "Get inspired with some famous quotes",
  emoji: "📦",
  toggleable: true,
  name: "inspire",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let req = await bot.fetch(`https://type.fit/api/quotes`).then(res => res.json())
      .then(json => {
        return json;
      }).catch(e => { return bot.error(bot, message, language, e); });
    let quote = req[Math.floor(Math.random() * req.length)];
    let author;
    if (quote.author === null) {
      author === "Anonymous";
    } else {
      author = quote.author;
    }
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} needs inspiration!`, message.author.displayAvatarURL({ format: "png" }))
      .setColor(bot.colors.blue)
      .setDescription(bot.translate(bot, language, "inspire.success").join("\n")
        .replace(/{QUOTE}/g, quote.text)
        .replace(/{AUTHOR}/g, author));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}