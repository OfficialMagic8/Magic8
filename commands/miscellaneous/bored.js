const { MessageEmbed } = require("discord.js");
const activities = ["recreational", "relaxation", "education", "cooking", "diy", "social", "music", "busywork", "charity"]
module.exports = {
  aliases: ["imbored"],
  category: "MISCELLANEOUS",
  description: "Bored? Try this!",
  emoji: "📦",
  name: "bored",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!args[0]) {
      bot.fetch("https://www.boredapi.com/api/activity").then(res => res.json()).then(json => {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "bored.title")
            .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: "true" }))
          .setColor(bot.colors.blue)
          .setDescription(bot.translate(bot, language, "bored.description").join("\n")
            .replace(/{ACTIVITY}/g, json.activity)
            .replace(/{CATEGORY}/g, json.type)
            .replace(/{PEOPLE}/g, json.participants))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else if (activities.includes(args[0].toLowerCase())) {
      bot.fetch(`http://www.boredapi.com/api/activity?type=${args[0].toLowerCase()}`).then(res => res.json()).then(json => {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "bored.title")
            .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: "true" }))
          .setColor(bot.colors.blue)
          .setDescription(bot.translate(bot, language, "bored.description").join("\n")
            .replace(/{ACTIVITY}/g, json.activity)
            .replace(/{CATEGORY}/g, json.type)
            .replace(/{PEOPLE}/g, json.participants))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "bored.invalidcategory").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{CATEGORIES}/g, activities.map(a => `\`${a}\``).join(" ")));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}