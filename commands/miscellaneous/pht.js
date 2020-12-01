const Discord = require("discord.js");
const lettersize = 180
const font = `bold ${lettersize}px Impact`
const additionalheight = lettersize / 4;
const regex = /\_|p|q|g|y|,|.|@|\|/g
module.exports = {
  aliases: ["pht"],
  category: "MISCELLANEOUS",
  description: "Create a PornHub style image - Requires `Manage Server` Permission",
  emoji: ":regional_indicator_p:",
  name: "pornhubtext",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return;
    let x = bot.canvas.createCanvas(10, 10).getContext('2d');
    x.font = font;
    message.delete({ timeout: 500 }).catch(e => { })
    let messagetosend = args.join(" ").split("|");
    let cleanmessage = messagetosend.map(m => m.trim()).filter(m => m.length >= 1);
    if (!messagetosend) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "pornhubtext.messagerequired")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (cleanmessage.length < 2) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "pornhubtext.nobar").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    parts = cleanmessage.map(l => l.trim());
    let first = parts[0];
    let second = parts[1];
    let sizefirst = measureText(first);
    let sizesecond = measureText(second);
    let widthfirst = (sizefirst.width >= 30000 ? 30000 : sizefirst.width) + (lettersize / 3);
    let heightfirst = (sizefirst.actualBoundingBoxAscent) + (lettersize / 3);
    let matchfirst = first.match(regex);
    let additionalfirst = matchfirst && matchfirst.length >= 1;
    let widthsecond = (sizesecond.width >= 30000 ? 30000 : sizesecond.width) + (lettersize / 3);
    let heightsecond = (sizesecond.actualBoundingBoxAscent) + (lettersize / 3);
    let matchsecond = second.match(regex);
    let additionalsecond = matchsecond && matchsecond.length >= 1;
    let greaterheight = Math.max(heightfirst, heightsecond);
    let totalwidth = widthfirst + widthsecond;
    let finalheight = greaterheight + ((additionalfirst || additionalsecond) ? additionalheight : 0);
    let canvas = bot.canvas.createCanvas(totalwidth, finalheight);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffa31a";
    ctx.fillRect(widthfirst - (lettersize / 12), 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(first, widthfirst / 2, greaterheight / 2)
    ctx.fillStyle = "#000000";
    ctx.fillText(second, widthfirst + (widthsecond / 2) - (lettersize / 12), greaterheight / 2);
    return message.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: 'ph.png' }]
    }).catch(e => { return bot.error(bot, message, language, e); });
    function measureText(text = "") {
      if (text.length === 0) {
        return { width: 0, height: 0 };
      }
      return x.measureText(text);
    }
  }
}
/*
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
  let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
  if (typeof stroke == "undefined") {
      stroke = true;
  }
  if (typeof radius === "object") {
      for (let side in radius) {
          cornerRadius[side] = radius[side];
      }
  }
  this.beginPath();
  this.moveTo(x + cornerRadius.upperLeft, y);
  this.lineTo(x + width - cornerRadius.upperRight, y);
  this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
  this.lineTo(x + width, y + height - cornerRadius.lowerRight);
  this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
  this.lineTo(x + cornerRadius.lowerLeft, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
  this.lineTo(x, y + cornerRadius.upperLeft);
  this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
  this.closePath();
  if (stroke) {
      this.stroke();
  }
  if (fill) {
      this.fill();
  }
}
*/