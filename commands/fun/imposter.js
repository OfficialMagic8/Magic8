const { MessageEmbed } = require("discord.js");
const colors = ["blue", "red", "darkgreen", "lime", "orange", "pink", "white", "yellow", "brown", "purple", "black", "cyan"];
const isimposter = ["true", "false"];
const baseURL = "https://vacefron.nl/api/ejected?name={USERNAME}&impostor={ISIMPOSTER}&crewmate={COLOR}";
module.exports = {
  aliases: [],
  category: "FUN",
  description: "Discover the real imposter in your Discord server",
  emoji: "🕵️",
  name: "imposter",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let color = colors[Math.floor(Math.random() * colors.length)];
    let imposter = isimposter[Math.floor(Math.random() * isimposter.length)];
    let url = baseURL.replace(/{USERNAME}/g, message.author.username).replace(/{ISIMPOSTER}/g, imposter).replace(/{COLOR}/g, color);
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setImage(url)
        .setAuthor(bot.translate(bot, language, "imposter.title")
          .replace(/{USERNAME}/g, message.author.username)
          .replace(/{GUILDNAME}/g, message.guild.name), message.author.displayAvatarURL({ format: "png" }));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}  