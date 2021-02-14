const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["pf"],
  category: "ADMINISTRATOR",
  description: "Set the custom prefix for your server\nRequires `Manage Server` Permission",
  emoji: "📝",
  name: "prefix",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0] || args[0].length <= 0) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(`${bot.user.username} - Prefix Settings`)
        .setThumbnail(bot.user.displayAvatarURL({ formant: "png" }))
        .setDescription(bot.translate(bot, language, "prefix.menu").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{WARNING}/g, bot.emoji.warning));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (![`<@${bot.user.id}>`, `<@!${bot.user.id}>`].includes(args[0]) && (message.mentions.roles.size > 0 || message.mentions.users.size > 0)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "prefix.hasmention")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let newPrefix = args[0];
    bot.prefixes.set(message.guild.id, newPrefix)
    bot.db.prepare("UPDATE guilddata SET prefix=? WHERE guildid=?").run(newPrefix, message.guild.id);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "prefix.updated").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{NEWPREFIX}/g, newPrefix)
        .replace(/{INFO}/g, bot.emoji.info)
        .replace(/{BOT}/g, bot.user));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}