const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "UTILITIES",
  description: "Send a message through Magic8 in the channel or a specefied channel - Requires `Manage Messages` Permission - Placeholders for message: {EVERYONE} and {HERE}",
  emoji: "🗣️",
  name: "say",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    message.delete({ timeout: 500 }).catch(e => { });
    let channel = message.channel;
    let msg;
    if (args[0]) {
      let channelid = args[0].replace(/[^0-9]/g, "");
      if (message.guild.channels.cache.has(channelid)) {
        channel = message.guild.channels.cache.get(channelid);
        msg = args.slice(1).join(" ")
      } else {
        msg = args.join(" ")
      }
    }
    if (!msg) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setFooter(bot.translate(bot, language, "say.tip"))
        .setDescription(bot.translate(bot, language, "say.messagerequired")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return channel.send(embed).catch(e => { });
    } else {
      let permissions = message.guild.me.permissionsIn(channel);
      if (!permissions || !permissions.has("SEND_MESSAGES")) {
        let language = bot.utils.getLanguage(bot, guildData.language);
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "say.permissionrequired")
            .replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { })
      } else {
        if (message.member.hasPermission("MENTION_EVERYONE")) {
          return channel.send(msg
            .replace(/@everyone/gi, "@ everyone")
            .replace(/@here/gi, "@ here")
            .replace(/{EVERYONE}/gi, "@everyone")
            .replace(/{HERE}/gi, "@here"))
            .catch(e => { });
        } else {
          return channel.send(msg).catch(e => { });
        }
      }
    }
  }
}