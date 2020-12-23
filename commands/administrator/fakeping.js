const { MessageEmbed } = require("discord.js");
const Imgur = require("imgur");
const prettyMs = require("pretty-ms");
const cooldown = 300000;
const pinglink = "https://i.imgur.com/xX8vAaV.png";
module.exports = {
  aliases: ["fp"],
  category: "ADMINISTRATOR",
  description: "Create a fake ping badge on your server icon\nRequires `Manage Server` Permission",
  emoji: "🔔",
  name: "fakeping",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    message.delete({ timeout: 500 }).catch(e => { });
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.fakepingcooldown.has(message.guild.id)) {
      let cooldownobject = bot.fakepingcooldown.get(message.guild.id)
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setThumbnail(cooldownobject.link)
        .setDescription(bot.translate(bot, language, "fakeping.cooldown").join("\n")
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{TIME}/g, prettyMs(Date.now() - cooldownobject.date))
          .replace(/{USER}/g, cooldownobject.user)
          .replace(/{LEFT}/g, prettyMs(cooldownobject.date + cooldown - Date.now())))
      return message.channel.send(embed).catch(e => { });
    }
    if (!message.guild.iconURL()) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "fakeping.guildnoicon").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let image;
    let dataURL;
    let canvas;
    try {
      image = await bot.canvas.loadImage(message.guild.iconURL({ format: "png" }))
      canvas = bot.canvas.createCanvas(600, 600);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, 600, 600)
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(441, 441, 135, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.restore();
      let pingimage = await bot.canvas.loadImage(pinglink)
      ctx.drawImage(pingimage, 441 + 1 - (pingimage.width / 2), 441 + 1 - (pingimage.height / 2), 210, 210)
      dataURL = await canvas.toDataURL();
    } catch (e) { return bot.error(bot, message, language, e); }
    let base64 = dataURL.slice(dataURL.indexOf("base64,") + 7);
    let parsed;
    try {
      parsed = await Imgur.uploadBase64(base64);
    } catch (e) { return bot.error(bot, message, language, e); }
    let link = parsed.data.link;
    let cooldownobject = {
      link: link,
      date: Date.now(),
      user: message.author
    };
    bot.fakepingcooldown.set(message.guild.id, cooldownobject)
    let embed = new MessageEmbed()
      .setDescription(bot.translate(bot, language, "fakeping.success").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{NEW}/g, link)
        .replace(/{OLD}/g, message.guild.iconURL({ format: "png", dynamic: true })))
      .setColor(bot.colors.main)
      .setImage(link)
    setTimeout(() => {
      bot.fakepingcooldown.delete(message.guild.id);
    }, cooldown);
    return message.channel.send(embed).then(async m => {
      try {
        await m.react("✅");
        await m.react("❌");
      } catch (e) { }
      const filter = (reaction, user) => !user.bot && ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id
      m.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
        m.reactions.removeAll().catch(e => { });
        let reaction = collected.first();
        if (reaction.emoji.name === "✅") {
          if (!message.guild.me.hasPermission("MANAGE_GUILD")) {
            updateToManual(m, embed, bot, language, link);
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "fakeping.notupdatedperms")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{USER}/g, message.author)
                .replace(/{BOT}/g, bot.user))
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
          message.guild.setIcon(link, `Updated by ${message.author.tag}(${message.author.id}) using Magic8's FakePing feature!`).then(g => {
            updateToManual(m, embed, bot, language, link);
            embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription(bot.translate(bot, language, "fakeping.updated")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{USER}/g, message.author))
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }).catch(e => {
            updateToManual(m, embed, bot, language, link);
            return bot.error(bot, message, language, e);
          })
        } else {
          updateToManual(m, embed, bot, language, link);
          embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "fakeping.notupdated")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      }).catch(e => {
        updateToManual(m, embed, bot, language, link);
        m.reactions.removeAll().catch(e => { });
        embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "fakeping.notupdated")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      });
    }).catch(e => { });
    function updateToManual(message, embed, bot, language, link) {
      embed.setDescription(bot.translate(bot, language, "fakeping.successmanual").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{NEW}/g, link)
        .replace(/{OLD}/g, message.guild.iconURL({ format: "png" })))
      return message.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}