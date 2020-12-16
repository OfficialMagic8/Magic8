const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["vc"],
  name: "viewcollection",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let collection;
    try {
      collection = Object.fromEntries(bot[args[0]])
    } catch (e) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **Could not find that collection:** \`${args[0]}\``)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
    }
    if (args[1]) {
      if (!bot.guilds.cache.has(args[1])) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(`${bot.emoji.cross} **Could not find that guild:** ${args[1]}`)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
      }
      try {
        let m = [
          `\`\`\`json`,
          `${JSON.stringify(bot[args[0]].get(args[1]), null, 2)}`,
          `\`\`\``
        ]
        return message.channel.send(m).catch(e => {
          bot.hastebin(JSON.stringify(collection, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
            return message.channel.send(`**Haste:** ${haste}`).catch(e => { })
          }).catch(e => { });
        });
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(`${bot.emoji.cross} **Could not find that guild in that collection:** \`${args[0]}\``)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
      }
    } else {
      let m = [
        `\`\`\`json`,
        `${JSON.stringify(collection, null, 2)}`,
        `\`\`\``
      ]
      return message.channel.send(m).catch(e => {
        bot.hastebin(JSON.stringify(collection, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
          return message.channel.send(`**Haste:** ${haste}`).catch(e => { })
        }).catch(e => { });
      });
    }
  }
}