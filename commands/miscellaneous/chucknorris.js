const Discord = require("discord.js");
module.exports = {
  aliases: ["norris", "cn"],
  category: "MISCELLANEOUS",
  emoji: "📦",
  description: "Chuck norris jokes!",
  name: "chucknorris",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let req;
    try {
      req = await bot.fetch(`https://api.chucknorris.io/jokes/random/`).then(res => res.json()).then(json => { return json });
    } catch (e) {
      console.error(e);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "unexpectederror")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{INVITE}/g, bot.invite));
      return message.channel.send(embed).catch(e => { });
    }
    let chucknorris = new Discord.MessageEmbed()
      .setDescription(`${bot.emoji.check} **${req.value}**`)
      .setThumbnail(req.icon_url)
      .setColor(bot.colors.blue)
    return message.channel.send(chucknorris).catch(e => { });
  }
}