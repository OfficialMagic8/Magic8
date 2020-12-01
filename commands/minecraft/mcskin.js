const { MessageEmbed } = require("discord.js");
const MojangAPI = require("mojang-api");
const helmURL = "https://minotar.net/helm/{USER}/100.png";
const profileURL = "https://es.namemc.com/profile/{USER}";
const niceBodyURL = "https://visage.surgeplay.com/full/512/{UUID}.png";
module.exports = {
  aliases: ["skin", "mcs"],
  category: "MINECRAFT",
  description: "Get a Minecrafter's Skin",
  emoji: "🎮",
  name: "mcskin",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let username = args.join(" ")
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!username) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "mcskin.enterusername")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replae(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let profileLink = profileURL.replace(/{USER}/g, username);
    let helmLink = helmURL.replace(/{USER}/g, username);
    if (true) {
      let date = new Date();
      MojangAPI.uuidAt(username, date, function (err, res) {
        if (res) {
          let uuid = res.id;
          let niceLink = niceBodyURL.replace(/{UUID}/g, uuid);
          bot.canvas.loadImage(niceLink).then(image => {
            let embed = new MessageEmbed()
              .setImage(niceLink)
              .setColor(bot.colors.main)
              .setAuthor(bot.translate(bot, language, "mcskin.success")
                .replace(/{USER}/g, username), helmLink, profileLink);
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }).catch(e => {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "mcskin.invalid")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{USER}/g, message.author)
                .replace(/{TOSEARCH}/g, username));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          });
        } else if (err) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "mcskin.invalid")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author)
              .replace(/{TOSEARCH}/g, username));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
      });
      return;
    }
  }
}