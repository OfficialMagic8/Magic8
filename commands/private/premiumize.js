const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  description: "Enable premium for a guild.",
  emoji: "💎",
  name: "premiumize",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!bot.guilds.cache.has(args[0])) return;
    let guild = bot.guilds.cache.get(args[0]);
    if (!args[1]) return;
    if (isNaN(args[1])) return;
    if (bot.guilds.cache.has(guild.id)) {
      bot.db.prepare("UPDATE guilddata SET premium=? WHERE guildid=?").run(parseInt(args[1]), guild.id);
      bot.premium.set(message.guild.id, parseInt(args[1]))
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([`${bot.emoji.check} **Set \`${guild.name}\` Premium To: ${parseInt(args[1])}**`]);
      return message.channel.send(embed).catch(e => { });
    }
  }
}