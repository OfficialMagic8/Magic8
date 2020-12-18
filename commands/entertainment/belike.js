const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["bl"],
  category: "ENTERTAINMENT",
  description: "Recreate Be Like Billy",
  emoji: "👨",
  name: "belike",
  toggleable: true,
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (args.length === 0) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "belike.providename")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let name;
    let gendershort;
    let gender;
    if (args.length === 1) {
      name = args[0];
      let id = args[0].replace(/[^0-9]/g, "");
      if (bot.users.cache.has(id)) name = bot.users.cache.get(id).username.replace(/\s+/g, "_");
      if (Math.floor(Math.random() * 100) < 75) {
        gendershort = "m";
        gender = "male";
      } else {
        gendershort = "f";
        gender = "female";
      }
    } else {
      if (["male", "m", "female", "f"].includes(args[0].toLowerCase())) {
        if (args[0].toLowerCase().startsWith("m")) {
          gendershort = "m";
          gender = "male";
        } else {
          gendershort = "f";
          gender = "female";
        }
        name = args.slice(1).join("%20");
        let id = args[0].replace(/[^0-9]/g, "");
        if (bot.users.cache.has(id)) name = bot.users.cache.get(id).username.replace(/\s+/g, "_");
      } else {
        name = args.join("%20");
        let id = args[0].replace(/[^0-9]/g, "");
        if (bot.users.cache.has(id)) name = bot.users.cache.get(id).username.replace(/\s+/g, "_");
        if (Math.floor(Math.random() * 100) < 75) {
          gendershort = "m";
          gender = "male";
        } else {
          gendershort = "f";
          gender = "female";
        }
      }
    }
    let embed = new MessageEmbed()
      .setColor(gendershort === "m" ? bot.colors.blue : bot.colors.pink)
      .setImage(`https://belikebill.ga/billgen-API.php?default=1&name=${name}&sex=${gender === "male" ? "m" : "f"}`)
      .setDescription(bot.translate(bot, language, "belike.description")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}