const Discord = require("discord.js");
module.exports = {
  aliases: ["purge", "del"],
  category: "UTILITIES",
  description: "Clear a number of messages from the channel - Requires `Manage Messages` Permission",
  emoji: "⚙️",
  name: "clear",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.nopermission")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{BOT}/g, bot.user));
      return message.channel.send(embed).catch(e => { })
    }
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.enteramount")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    if (isNaN(args[0])) {
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.invalidamount")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    let amount = parseInt(args[0]);
    if (amount > 100) {
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.cannotgreater")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    if (amount < 1) {
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "clear.cannotlower")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    try {
      let toDelete = await message.channel.messages.fetch({ limit: amount <= 100 ? amount : 100, before: message.id });
      let deleted = await message.channel.bulkDelete(toDelete, { filterOld: true });
      let success = new Discord.MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "clear.deleted")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{AMOUNT}/g, deleted.size));
      return message.channel.send(success).catch(e => { });
    } catch (e) {
      bot.error(bot, message, language, e);
    }
  }
}