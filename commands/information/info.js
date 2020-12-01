const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["si"],
  category: "INFO",
  description: "Your server information",
  emoji: "📚",
  name: "info",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let premiumstatus;
    if (bot.premium.get(message.guild.id) === 0) {
      premiumstatus = " ";
    } else if (bot.premium.get(message.guild.id) === 1) {
      premiumstatus = "💎 **Premium: `I`**\n";
    } else if (bot.premium.get(message.guild.id) === 2) {
      premiumstatus = "💎 **Premium: `II`**\n";
    }
    let bots = bot.users.cache.filter(c => c.user.bot).size;
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "info.title")
        .replace(/{GUILDNAME}/g, message.guild.name))
      .setColor(bot.colors.main)
      .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
      .setDescription(bot.translate(bot, language, "info.description").join("\n")
        .replace(/{PREFIX}/g, guildData.prefix)
        .replace(/{USERS}/g, bot.users.cache.size - bots)
        .replace(/{BOTS}/g, bots)
        .replace(/{ONLINE}/g, bot.users.cache.filter(m => m.presence.status !== "offline").size)
        .replace(/{TEXTCHANNELS}/g, message.guild.channels.cache.filter(c => c.type === "text").size)
        .replace(/{VOICECHANNELS}/g, message.guild.channels.cache.filter(c => c.type === "voice").size)
        .replace(/{PREMIUM}/g, premiumstatus)
        .replace(/{OWNER}/g, message.guild.owner)
        .replace(/{CREATED}/g, message.guild.createdAt.toLocaleString().split("GMT")[0].trim())
        .replace(/{JOINED}/g, bot.guilds.cache.get(message.guild.id).joinedAt.toLocaleString().split("GMT")[0].trim())
        .replace(/{MAGIC8}/g, bot.emoji.magic8)
        .replace(/{LANGUAGE}/g, guildData.language));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}