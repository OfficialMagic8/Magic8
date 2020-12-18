const { MessageEmbed } = require("discord.js");
const hastebin = require("hastebin-gen");
module.exports = {
  aliases: ["guilddata"],
  category: "ADMINISTRATOR",
  name: "data",
  description: "Guild Data",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    // hastebin(JSON.stringify(guildData, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
    //   let data = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(`${bot.emoji.check} **Data fetched:** ${haste}`)
    //   return message.channel.send(data).catch(console.error);
    // }).catch(e => {
    //   let error = new MessageEmbed()
    //     .setColor(bot.colors.red)
    //     .setDescription(`${bot.emoji.cross} **There was an error fetching your data!**`)
    //   return message.channel.send(error).catch(console.error)
    // })
  }
}