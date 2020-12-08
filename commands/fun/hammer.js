const { MessageEmbed } = require("discord.js");
const random50 = [
  50,
  100
]
const lowImage = [
  "https://66.media.tumblr.com/85a1de677c2f387bc4331de212f66f1a/tumblr_mk6av4eCJz1s02vreo1_400.gif",
]
const medHighImage = [
  "http://www.wexley.com/uploads/14/08/lyft-dick.gif",
  "https://media.giphy.com/media/xTiTnpHNjjhIdqF1fy/giphy.gif",
  "https://i.gifer.com/A15k.gif",
  "https://media1.tenor.com/images/3f63d65a05fda0addb2599ed7208282e/tenor.gif"
]
module.exports = {
  aliases: ["mallet"],
  category: "FUN",
  description: "Test your strength!",
  emoji: "🔨",
  name: "hammer",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.playingmallet.has(message.author.id)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "hammer.alreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    bot.playingmallet.set(message.author.id);
    let malletEmbed = new MessageEmbed()
      .setColor(guildData.funcolor)
      .setThumbnail("https://i.imgur.com/Mb5W1wy.png")
      .setAuthor(bot.translate(bot, language, "hammer.starting.title")
        .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: true }))
      .setImage("https://thumbs.gfycat.com/NaiveCelebratedDwarfrabbit-max-1mb.gif")
      .setDescription(bot.translate(bot, language, "hammer.starting.description"));
    let malletMessage;
    try {
      malletMessage = await message.channel.send(malletEmbed);
    } catch (e) {
      bot.playingmallet.delete(message.author.id)
      bot.error(bot, message, language, e);
    }
    setTimeout(async () => {
      malletMessage.react((bot.emoji.mallet).replace(">", "")).catch(e => {
        bot.error(bot, message, language, e);
      });
      let filter = (reaction, user) => !user.bot && user.id === message.author.id && reaction.emoji.id === "711678430302961785"
      let collected;
      try {
        collected = await malletMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ["time"] })
      } catch (e) {
      }
      let h = bot.translate(bot, language, "hammer.hitdescription")
      let hitDescription = bot.translate(bot, language, "hammer.hit").join("\n")
        .replace(/{HITDESCRIPTION}/g, h[Math.floor(Math.random() * h.length)])
      malletEmbed.setDescription(hitDescription)
      try {
        await malletMessage.edit(malletEmbed)
      } catch (e) {
        console.error(e);
        bot.playingmallet.delete(message.author.id);
        bot.error(bot, message, language, e);
      }
      setTimeout(async () => {
        let tenValue = (Math.floor(Math.random() * 10) * 100);
        let finalValue = tenValue + random50[Math.floor(Math.random() * random50.length)];
        let randomDesc;
        let finalImage;
        if (finalValue < 500) {
          let l = bot.translate(bot, language, "hammer.low");
          finalImage = lowImage[Math.floor(Math.random() * lowImage.length)];
          randomDesc = l[Math.floor(Math.random() * l.length)];
        } else if (finalValue > 800) {
          let h = bot.translate(bot, language, "hammer.high");
          finalImage = medHighImage[Math.floor(Math.random() * medHighImage.length)];
          randomDesc = h[Math.floor(Math.random() * h.length)];
        } else {
          let m = bot.translate(bot, language, "hammer.med");
          finalImage = medHighImage[Math.floor(Math.random() * medHighImage.length)];
          randomDesc = m[Math.floor(Math.random() * m.length)];
        }
        let successdescription = bot.translate(bot, language, "hammer.successdescription").join("\n")
          .replace(/{FINALVALUE}/g, finalValue)
          .replace(/{RANDOMDESCRIPTION}/g, randomDesc);
        malletEmbed.setDescription(successdescription).setImage(finalImage);
        malletMessage.reactions.removeAll().catch(e => { });
        malletMessage.edit(malletEmbed).catch(e => { });
        return bot.playingmallet.delete(message.author.id);
      }, 4000)
    }, 1000)
  }
}