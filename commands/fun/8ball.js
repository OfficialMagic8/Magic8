const Discord = require("discord.js");
module.exports = {
  aliases: ["8b", "ball"],
  category: "FUN",
  description: "A Magic 8 Ball that will answer all your questions - Yes/No/Maybe questions are the best type to ask",
  emoji: "🎱",
  name: "8ball",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (!args[0]) {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "8ball.asksomething").replace(/{CROSS}/g, bot.emoji.cross).replace(/{USER}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    let type;
    let replies;
    if (guildData.ballreplytype === 3) {
      type = "Custom";
      let repliesString = guildData.ballcustomresponses;
      if (guildData.ballcustomresponses === "none" || repliesString.split("|").length <= 1) {
        let language = bot.utils.getLanguage(bot, guildData.language);
        if (message.member.hasPermission("ADMINISTRATOR")) {
          let error = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "8ball.customresponsesadmin").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(error).catch(e => { });
        } else {
          let error = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "8ball.customresponses").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross));
          return message.channel.send(error).catch(e => { });
        }
      } else {
        replies = repliesString.split("|");
      }
    } else {
      let language = bot.utils.getLanguage(bot, guildData.language);
      if (guildData.ballreplytype === 2) {
        type = "Explicit";
        replies = bot.translate(bot, language, "8ball.replies.explicit");
      } else if (guildData.ballreplytype === 1) {
        type = "All";
        replies = bot.translate(bot, language, "8ball.replies.all");
      } else {
        type = "Clean";
        replies = bot.translate(bot, language, "8ball.replies.clean");
      }
    }
    let language = bot.utils.getLanguage(bot, guildData.language);
    let question = args.join(" ");
    let response = replies[Math.floor(Math.random() * replies.length)];
    let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(message.guild.id);
    let usagearray = JSON.parse(usageData.usage)
    let find = usagearray.find(i => i.command === "8ball")
    let embed = new Discord.MessageEmbed()
      .setColor(guildData.ballcolor)
      .setAuthor(bot.translate(bot, language, "8ball.askedquestion")
        .replace(/{USERNAME}/g, message.author.username)
        .replace(/{NUMBER}/g, find.usage + 1), message.author.displayAvatarURL({ format: "png" }))
      .addField(bot.translate(bot, language, "8ball.question"), question)
      .addField(bot.translate(bot, language, "8ball.answer"), response)
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
  }
}