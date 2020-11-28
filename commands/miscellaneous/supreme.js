const Discord = require("discord.js");
const lettersize = 120
const font = `italic bold ${lettersize}px Impact`
const additionalheight = lettersize / 4;
const regex = /\_|p|q|g|y|,|.|@|\|/g
module.exports = {
  aliases: [],
  category: "MISCELLANEOUS",
  description: "Create a Supreme style image - Requires `Manage Server` Permission",
  emoji: ":regional_indicator_s:",
  name: "supreme",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return;
    let x = bot.canvas.createCanvas(10, 10).getContext('2d');
    x.font = font
    message.delete({ timeout: 500 }).catch(e => { });
    let messagetosend = args.join(" ")
    if (!messagetosend) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "supreme.messagerequired")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { });
    }
    let size = measureText(messagetosend);
    let width = (size.width >= 30000 ? 30000 : size.width) + (lettersize / 4)
    let height = (size.actualBoundingBoxAscent) + (lettersize / 4)
    let match = messagetosend.match(regex);
    let additional = match && match.length >= 1
    let canvas = bot.canvas.createCanvas(width, height + (additional ? additionalheight : 0))
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "#ED1C24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = font
    ctx.textAlign = "center"
    ctx.textBaseline = 'middle'
    ctx.fillStyle = "#ffffff"
    ctx.fillText(messagetosend, width / 2, height / 2)
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'supreme.png');
    message.channel.send({
      files: [{
        attachment: canvas.toBuffer(),
        name: 'supreme.png'
      }]
    }).catch(e => {
      console.log(e)
    })
    function measureText(text = "") {
      if (text.length === 0) {
        return { width: 0, actualBoundingBoxAscent: 0 };
      }
      return x.measureText(text);
    }
  }
} 