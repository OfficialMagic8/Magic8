const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["spin"],
  category: "FUN",
  description: "Spin a fidghet spinner",
  emoji: "📦",
  name: "spinner",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.spinningspinner.has(message.author.id)) {
      let alreadyspinning = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "spinner.alreadyspinning")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(alreadyspinning).catch(e => { });
    }
    let time = ((Math.floor(Math.random() * 3001) + 10) / 10).toFixed(1);
    let milliseconds = time * 1000;
    let object = {
      userid: message.author.id,
      duration: milliseconds
    }
    bot.spinningspinner.set(message.author.id, object);
    let embed = new MessageEmbed()
      .setColor(bot.colors.green)
      .setDescription(bot.translate(bot, language, "spinner.spinning")
        .replace(/{SPINNER}/g, bot.emoji.spinner)
        .replace(/{USER}/g, message.author));
    let spinnerMessage = await message.channel.send(embed).catch(e => {
      bot.error(bot, message, language, e);
    });
    setTimeout(() => {
      bot.spinningspinner.delete(message.author.id);
      embed.setDescription(bot.translate(bot, language, "spinner.spun")
        .replace(/{SPINNER}/g, bot.emoji.spinnerstopped)
        .replace(/{USER}/g, message.author)
        .replace(/{TIME}/g, bot.ms(milliseconds)));
      spinnerMessage.edit(embed).catch(e => {
        bot.error(bot, message, language, e);
      })
    }, milliseconds);
  }
}