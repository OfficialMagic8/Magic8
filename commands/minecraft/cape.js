const { MessageEmbed } = require("discord.js");
const MojangAPI = require("mojang-api");
const bodyURL = "https://minotar.net/armor/body/{USER}/300.png";
const headURL = "https://minotar.net/cube/{USER}/100.png";
const helmURL = "https://minotar.net/helm/{USER}/100.png";
const profileURL = "https://es.namemc.com/profile/{USER}";
const capeURL = "http://s.optifine.net/capes/{USER}.png";
const resizeURL = "https://images.weserv.nl/?url={URL}&w=300"
module.exports = {
  aliases: ["capa", "capas", "capes"],
  category: "MINECRAFT",
  description: "Get a Minecrafter's Cape",
  emoji: "🎮",
  name: "cape",
  // dev: true,
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let toSearch = args[0]
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!toSearch) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "cape.invalid")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    //   if(message.author.id !== "290640988677079041"){
    //   let bodyLink = bodyURL.replace(/{USER}/g,username);
    //   let headLink = headURL.replace(/{USER}/g,username);
    //   let helmLink = helmURL.replace(/{USER}/g,username);
    //   let profileLink = profileURL.replace(/{USER}/g,username);
    //   let capeLink = capeURL.replace(/{USER}/g,username);
    //   let resizeLink = resizeURL.replace(/{URL}/g,capeLink);
    //   bot.canvas.loadImage(bodyLink).then(image=>{
    //     bot.canvas.loadImage(capeLink).then(cape=>{
    //       let success = new MessageEmbed()
    //         .setAuthor(bot.translate(bot,language,"cape.success.title").replace(/{USER}/g,username),helmLink,profileLink)
    //         .setThumbnail(cape.src)
    //         //.setDescription(bot.translate(bot,language,"cape.success.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross))
    //         .setImage(resizeLink)
    //         .setFooter(bot.translate(bot,language,"cape.success.footer").replace(/{BOTNAME}/g,bot.user.username).replace(/{VERSION}/g,bot.botconfig.version).replace(/{AUTHOR}/g,message.author.tag))
    //         .setColor(bot.colors.red)
    //       return message.channel.send(success).catch(e=>{})
    //     }).catch(e=>{
    //       let nocape = new MessageEmbed()
    //         .setDescription(bot.translate(bot,language,"cape.error.nocape.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,username))
    //         .setColor(bot.colors.red)
    //       return message.channel.send(nocape).catch(e=>{})
    //     })
    //   }).catch(e=>{
    //     let notregistered = new MessageEmbed()
    //       .setDescription(bot.translate(bot,language,"cape.error.notregistered.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,username))
    //       .setColor(bot.colors.red)
    //     return message.channel.send(notregistered).catch(e=>{})
    //   })

    //   return;
    //   }
    let uuid = undefined;
    let matchRegex = toSearch.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi);
    if (matchRegex && matchRegex.length !== 0) {
      uuid = toSearch;
      let uuid2 = uuid.replace(/-/g, "");
      MojangAPI.profile(uuid2, function (err, res) {
        if (err) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "cape.invalid")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let username = res.name;
        let helmLink = helmURL.replace(/{USER}/g, username);
        let profileLink = profileURL.replace(/{USER}/g, username);
        let capeLink = capeURL.replace(/{USER}/g, username);
        let resizeLink = resizeURL.replace(/{URL}/g, capeLink);
        bot.canvas.loadImage(capeLink).then(cape => {
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "cape.success")
              .replace(/{USER}/g, username), helmLink, profileLink)
            .setThumbnail(cape.src)
            .setImage(resizeLink)
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }).catch(e => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "cape.nocape")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author)
              .replace(/{TOSEARCH}/g, username));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        })
      })
    } else {
      let date = new Date();
      MojangAPI.uuidAt(toSearch, date, function (err, res) {
        if (err) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "cape.invalid")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, toSearch));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let username = res.name;
        let helmLink = helmURL.replace(/{USER}/g, username);
        let profileLink = profileURL.replace(/{USER}/g, username);
        let capeLink = capeURL.replace(/{USER}/g, username);
        let resizeLink = resizeURL.replace(/{URL}/g, capeLink);
        bot.canvas.loadImage(capeLink).then(cape => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setAuthor(bot.translate(bot, language, "cape.success")
              .replace(/{USER}/g, username), helmLink, profileLink)
            .setThumbnail(cape.src)
            .setImage(resizeLink);
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }).catch(e => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "cape.nocape")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, username));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        })
      })
    }
  }
}