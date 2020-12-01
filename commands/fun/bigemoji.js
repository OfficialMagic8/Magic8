const { MessageEmbed } = require("discord.js");
const regex = /^<:(a:)?\w+:[0-9]{18}>$/g
const idregex = /[0-9]{18}/g
const basepnglink = "https://cdn.discordapp.com/emojis/{EMOJIID}.png";
const basegiflink = "https://cdn.discordapp.com/emojis/{EMOJIID}.gif";
module.exports = {
  aliases: ["be"],
  category: "FUN",
  description: "Get the link to a custom emoji",
  emoji: "😜",
  name: "bigemoji",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let possibleEmoji = args[0];
    if (!possibleEmoji) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "bigemoji.error")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let matchs = possibleEmoji.match(regex);
    let animated = possibleEmoji.startsWith(":a:");
    let idmatchs = possibleEmoji.match(idregex);
    let invalidemoji = !matchs || matchs.length <= 0;
    if (invalidemoji || !idmatchs || idmatchs.length <= 0) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "bigemoji.error")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let emojiid = idmatchs[idmatchs.length - 1]
    let emojilink = (animated ? basegiflink : basepnglink).replace(/{EMOJIID}/g, emojiid);
    bot.canvas.loadImage(emojilink).then(image => {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "bigemoji.success")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{EMOJILINK}/g, emojilink))
        .setImage(emojilink)
        .setColor(bot.colors.funcolor)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }).catch(e => {
      bot.error(bot, message, language, e);
    });
  }
}
