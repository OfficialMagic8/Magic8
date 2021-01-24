const { MessageEmbed } = require("discord.js");
const colors = ["blue", "red", "darkgreen", "lime", "orange", "pink", "white", "yellow", "brown", "purple", "black", "cyan"];
const isimposter = ["true", "false"];
const baseURL = "https://vacefron.nl/api/ejected?name={USERNAME}&impostor={ISIMPOSTER}&crewmate={COLOR}";
module.exports = {
  aliases: [],
  category: "ENTERTAINMENT",
  description: "Discover the real imposter in your Discord server",
  emoji: "🕵️",
  name: "imposter",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let color = colors[Math.floor(Math.random() * colors.length)];
    let imposter = isimposter[Math.floor(Math.random() * isimposter.length)];
    let target = message.author;
    if (args[0]) {
      try {
        let id = args[0].replace(/[^0-9]/g, "");
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let url = baseURL.replace(/{USERNAME}/g, target.username.split(" ").join("%20")).replace(/{ISIMPOSTER}/g, imposter).replace(/{COLOR}/g, color);
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setImage(url)
      .setAuthor(bot.translate(bot, language, "imposter.title")
        .replace(/{USERNAME}/g, target.username)
        .replace(/{GUILDNAME}/g, message.guild.name), target.displayAvatarURL({ format: "png" }));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}  