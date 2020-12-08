const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "ADMIN",
  description: "Get updates from the Support Server directly to yours.",
  emoji: "▶️",
  name: "follow",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (!message.guild.me.hasPermission(["MANAGE_WEBHOOKS"])) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "follow.nopermission")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{BOT}/g, bot.user));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let options = [
      // "status",
      "updates"
    ];
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "follow.nooptiontitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setThumbnail(bot.user.displayAvatarURL({ formant: "png" }))
        .setDescription(bot.translate(bot, language, "folow.nooption").join("\n")
          .replace(/{INVITE}/g, bot.invite)
          .replace(/{OPTIONS}/g, options.map(o => `\`${o}\``).join(" "))
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    };
    if (!options.includes(args[0].toLowerCase())) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "follow.invalidoption").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{OPTIONS}/g, options.map(o => `\`${o}\``).join(" "))
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    };
    // if (args[0].toLowerCase() === options[0]) {
    //   bot.status.addFollower(message.channel.id, `Subscribed to ${options[0]}`).then(() => {
    //     let embed = new MessageEmbed()
    //       .setColor(bot.colors.green)
    //       .setDescription(bot.translate(bot, language, "follow.following").join("\n")
    //         .replace(/{CHECK}/g, bot.emoji.check)
    //         .replace(/{CHANNEL}/g, message.channel)
    //         .replace(/{FOLLOWING}/g, options[0]))
    //     return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    //   }).catch(e => {
    //     let embed = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.translate(bot, language, "follow.maxintegrations").join("\n")
    //         .replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{CHANNEL}/g, message.channel));
    //     return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    //   });
    // };
    if (args[0].toLowerCase() === options[1]) {
      bot.status.addFollower(message.channel.id, `Subscribed to ${options[1]}`).then(() => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "follow.following").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{CHANNEL}/g, message.channel)
            .replace(/{FOLLOWING}/g, options[1]))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "follow.maxintegrations").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{CHANNEL}/g, message.channel));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      });
    };
  }
};