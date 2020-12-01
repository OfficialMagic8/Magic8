const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "getlangs",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    try {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setFooter(`This could take up to a minute to update!`)
        .setDescription(`${bot.emoji.loading} **Attempting to fetch languages...**`)
      let embedmessage = await message.channel.send(embed)
      bot.utils.fetchLanguages(bot);
      setTimeout(() => {
        bot.utils.loadLanguageProgress(bot);
        embed.setColor(bot.colors.green)
        embed.setDescription(`${bot.emoji.check} **Languages fetched successfully!**`)
        return embedmessage.edit(embed).catch(e => { })
      }, 5000)
    } catch (e) {
      embed.setColor(bot.colors.red)
      embed.setDescription(`${bot.emoji.cross} **Languages could not be fetched!**`)
      return embedmessage.edit(embed).catch(e => { })
    }
  }
}