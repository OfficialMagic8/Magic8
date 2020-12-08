const { MessageEmbed } = require("discord.js");
const MojangAPI = require("mojang-api");
// const bodyURL = "https://minotar.net/armor/body/{USER}/300.png";
// const headURL = "https://minotar.net/cube/{USER}/100.png";
const helmURL = "https://minotar.net/helm/{USER}/300.png";
const profileURL = "https://es.namemc.com/profile/{USER}";
// const capeURL = "http://s.optifine.net/capes/{USER}.png";
// const resizeURL = "https://images.weserv.nl/?url={URL}&w=300"
module.exports = {
  aliases: ["nh"],
  category: "MINECRAFT",
  description: "Get a Minecrafter's name history",
  emoji: "🎮",
  name: "namehistory",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let toSearch = args.join(" ")
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!toSearch) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "namehistory.enterusername")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let uuid = undefined;
    let matchRegex = toSearch.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi)
    if (matchRegex && matchRegex.length !== 0) {
      uuid = toSearch;
      MojangAPI.nameHistory(uuid, function (err, res) {
        if (err) {
          let embed = new MessageEmbed()
            .setDescription(bot.translate(bot, language, "namehistory.invalidusername")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author)
              .replace(/{TOSEARCH}/g, toSearch.replace(/_/g, "\_")))
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        res.reverse()
        let description;
        if (res.length === 1) {
          description = bot.translate(bot, language, "namehistory.success.unique").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{IGN}/g, res[0].name)
            .replace(/{UUID}/g, uuid)
        } else {
          let otherformat = bot.translate(bot, language, "namehistory.success.others.name");
          let mapped = res.map(r => r.changedToAt ?
            otherformat.replace(/{NAME}/g, r.name).replace(/{DATE}/g, (new Date(r.changedToAt)).toLocaleString().split()[0].trim()) :
            bot.translate(bot, language, "namehistory.success.others.original")
              .replace(/{NAME}/g, r.name));
          description = bot.translate(bot, language, "namehistory.success.others.description").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{IGN}/g, (res[0].name).replace(/_/g, "\_"))
            .replace(/{UUID}/g, uuid)
            .replace(/{HISTORY}/g, mapped.join("\n"))
        }
        let helmLink = helmURL.replace(/{USER}/g, uuid);
        let profileLink = profileURL.replace(/{USER}/g, toSearch);
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "namehistory.success.title")
            .replace(/{TOSEARCH}/g, toSearch), helmLink, profileLink)
          .setThumbnail(helmLink)
          .setDescription(description.replace(/{CHECK}/g, bot.emoji.check).replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, toSearch))
          // .setFooter(bot.translate(bot,language,"namehistory.success.footer").replace(/{BOTNAME}/g,bot.user.username)
          //            .replace(/{VERSION}/g,bot.botconfig.version).replace(/{AUTHOR}/g,message.author.tag))
          .setColor(bot.colors.main)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      })
    } else {
      let date = new Date();
      MojangAPI.uuidAt(toSearch, date, function (err, res) {
        if (err) {
          let embed = new MessageEmbed()
            .setDescription(bot.translate(bot, language, "namehistory.invalidusername")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author)
              .replace(/{TOSEARCH}/g, toSearch))
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        uuid = res.id;
        let parsedUUID = bot.utils.UUIDfromString(uuid);
        MojangAPI.nameHistory(uuid, function (err, res) {
          if (err) {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "namehistory.invalidusername")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{UESR}/g, message.author)
                .replace(/{TOSEARCH}/g, toSearch))
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
          res.reverse()
          let description;
          if (res.length === 1) {
            description = bot.translate(bot, language, "namehistory.success.unique").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{IGN}/g, (res[0].name).replace(/_/g, "\_"))
              .replace(/{UUID}/g, parsedUUID)
          } else {
            let otherformat = bot.translate(bot, language, "namehistory.success.others.name");
            let mapped = res.map(r => r.changedToAt ? otherformat.replace(/{NAME}/g, r.name)
              .replace(/{DATE}/g, (new Date(r.changedToAt)).toLocaleString().split()[0].trim()) :
              bot.translate(bot, language, "namehistory.success.others.original")
                .replace(/{NAME}/g, r.name));
            description = bot.translate(bot, language, "namehistory.success.others.description").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{IGN}/g, (res[0].name).replace(/_/g, "\_"))
              .replace(/{UUID}/g, parsedUUID)
              .replace(/{HISTORY}/g, mapped.join("\n"))
          }
          let helmLink = helmURL.replace(/{USER}/g, parsedUUID);
          let profileLink = profileURL.replace(/{USER}/g, toSearch);
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "namehistory.success.title")
              .replace(/{TOSEARCH}/g, toSearch), helmLink, profileLink)
            .setColor(bot.colors.main)
            .setThumbnail(helmLink)
            .setDescription(description.replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, toSearch));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        })
        return;
      })
    }
  }
}