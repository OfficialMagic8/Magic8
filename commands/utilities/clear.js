const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["purge", "del"],
  category: "UTILITIES",
  description: "Clear a number of messages from the channel - Requires `Manage Messages` Permission",
  emoji: "⚙️",
  name: "clear",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.nopermission")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{BOT}/g, bot.user));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.enteramount")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (isNaN(args[0])) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.invalidamount")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let amount = parseInt(args[0]);
    if (amount > 100) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.cannotgreater")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (amount < 1) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.cannotlower")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    try {
      let toDelete = await message.channel.messages.fetch({ limit: amount <= 100 ? amount : 100, before: message.id });
      let deleted = await message.channel.bulkDelete(toDelete, { filterOld: true });
      let success = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "clear.deleted")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{AMOUNT}/g, deleted.size));
      return message.channel.send(success).catch(e => { return bot.error(bot, message, language, e); });
    } catch (e) { return bot.error(bot, message, language, e); }
  }
}