const { MessageEmbed } = require("discord.js");
//nst Canvas = require("canvas");
const emojilinkanimated = "https://cdn.discordapp.com/emojis/{ID}.gif";
const emojilink = "https://cdn.discordapp.com/emojis/{ID}.png";
module.exports = {
  aliases: ["emojis"],
  description: "Add amazing custom emojis!",
  emoji: "😜",
  name: "emoji",
  dev: true,
  toggleable: true,
  category: "ENTERTAINMENT",
  run: async (bot, message, args, prefix, guildData) => {
    message.delete({ timeout: 500 }).catch(e => { });
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!message.member.hasPermission("MANAGE_EMOJIS")) {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.utils.getTranslation(bot, language, "emojis.error.permissiondescription").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
      return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { });
    }
    let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    if (subcommand === "add") {
      if (!message.guild.me.hasPermission("MANAGE_EMOJIS")) {
        let error = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.utils.getTranslation(bot, language, "emojis.error.insufficientdescription").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { });
      }
      let targetemoji = args[1] ? args[1].toLowerCase() : args[1];
      if (!target.useremoji) {
        let error = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.utils.getTranslation(bot, language, "emojis.error.requireddescription").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { });
      }
      if (!bot.customemojis.has(targetemoji)) {
        let error = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.utils.getTranslation(bot, language, "emojis.error.invalidemoji").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { });
      }
      let category = bot.customemojis.get(targetemoji);
      let emojiinfo = bot.customemojisobject[category].emojis[targetemoji];
      try {
        let link = emojiinfo.animated ? emojilinkanimated.replace(/{ID}/g, emojiinfo.id) : emojilink.replace(/{ID}/g, emojiinfo.id);
        //let image = await Canvas.loadImage(emojiinfo.animated?emojilinkanimated.replace(/{ID}/g,emojiinfo.id):emojilink.replace(/{ID}/g,emojiinfo.id));
        await message.guild.emojis.create(link, emojiinfo.name, [], `Added by ${message.author.tag}(${message.author.id}) using ${bot.user.username}`);
      } catch (e) {
        console.log(e)
        let error = new MessageEmbed()
          .setColor(bot.colors.red)
        if (e.code === 50013) {
          error.setDescription(bot.utils.getTranslation(bot, language, "emojis.error.insufficientdescription").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        } else if (e.message.toLowerCase().includes("limit")) {
          error.setDescription(bot.utils.getTranslation(bot, language, "emojis.error.limitdescription").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        } else if (e.message === "idk") {
          error.setDescription(bot.utils.getTranslation(bot, language, "emojis.error.othererrordescription").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        } else {
          error.setDescription(bot.utils.getTranslation(bot, language, "emojis.error.unknowndescription").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        }
        return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { });
      }
      let success = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.utils.getTranslation(bot, language, "emojis.success.description").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author)
          .replace(/{EMOJINAME}/g, emojiinfo.name)
          .replace(/{EMOJI}/g, emojiinfo.emoji)
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{VERIFIED}/g, bot.emoji.verified)
          .replace(/{}/g, bot.botconfig.invitation))
      return message.channel.send(success).then(m => m.delete({ timeout: 25000 }).catch(e => { })).catch(e => { });
    }
    if (!bot.emojisEmbed) {
      bot.emojisEmbed = new MessageEmbed()
        .setColor(bot.colors.pink)
        .setDescription(bot.utils.getTranslation(bot, language, "emojis.description").join("\n")
          .replace(/{INVITATION}/g, bot.botconfig.invitation)
          .replace(/{KAPPALUL}/g, bot.emoji.kappalul)
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{MAGIC8}/g, bot.emoji.magic8)
          .replace(/{BOT}/g, bot.user))
      // .setFooter(`${bot.user.username} v${bot.botconfig.version} • Emojis`);
      Object.keys(bot.customemojisobject).forEach(category => {
        let categoryDisplay = `• ${bot.customemojisobject[category].category.toUpperCase()} ${bot.customemojisobject[category].preview}`
        let emojisObject = bot.customemojisobject[category].emojis;
        let fieldDisplay = Object.keys(emojisObject).map(identifier => `${emojisObject[identifier].emoji}: ${emojisObject[identifier].name}`).join("\n")
        bot.emojisEmbed.addField(categoryDisplay, fieldDisplay, false)
      });
      bot.emojisEmbed.addField(`\u200b`, bot.utils.getTranslation(bot, language, "emojis.footer").join("\n")
        .replace(/{MAGIC8}/g, bot.emoji.magic8)
        .replace(/{BOT}/g, bot.user)
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{VERIFIED}/g, bot.emoji.verified)
        .replace(/{INVITATION}/g, bot.invite)
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{WARNING}/g, bot.emoji.warning)
        .replace(/{USER}/g, message.author), false)
    }
    return message.channel.send(bot.emojisEmbed).then(m => m.delete({ timeout: 45000 }).catch(e => { })).catch(e => { });
  }
}