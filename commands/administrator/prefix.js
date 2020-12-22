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
        .setDescription([
          `**Current Prefix:** \`${prefix}\``,
          ``,
          `${bot.emoji.info} To update the prefix, type: \`${prefix}prefix <prefix>\``,
          ``,
          `${bot.emoji.warning} Make sure you don't use special characters like chinese or unicode emojis!`]);
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let newPrefix = args[0];
    bot.prefixes.set(message.guild.id, newPrefix)
    bot.db.prepare("UPDATE guilddata SET prefix=? WHERE guildid=?").run(newPrefix, message.guild.id);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription([
        `${bot.emoji.check} **Updated Prefix:** \`${newPrefix}\``,
        ``,
        `${bot.emoji.info} ${bot.user} will always be an active prefix in case your forget yours.`]);
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}