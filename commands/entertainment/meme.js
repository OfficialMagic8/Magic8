const { MessageEmbed } = require("discord.js");
const Memejs = require("memejs");
module.exports = {
  aliases: ["memes"],
  category: "ENTERTAINMENT",
  description: "Get random memes!",
  emoji: "🤪",
  name: "meme",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let parsed;
    try {
      parsed = await Memejs.memeAsync("dankmemes");
    } catch (e) {
      bot.error(bot, message, language, e);
    }
    let meme = new MessageEmbed()
      .setTitle(parsed.title, `https://www.reddit.com/r/${parsed.subreddit}/`)
      .setColor(guildData.funcolor)
      .setImage(parsed.url.endsWith(".gifv") ? parsed.url.substring(0, parsed.url.length - 1) : parsed.url)
    return message.channel.send(meme).catch(e => { });
  }
}  