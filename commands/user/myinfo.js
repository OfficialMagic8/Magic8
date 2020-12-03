const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["me"],
  category: "USER",
  description: "View your own member information in the server.",
  emoji: "👤",
  name: "myinfo",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (args[0] && message.author.id === "292821168833036288") {
      try {
        let user = await bot.users.fetch(args[0])
        let embed = new MessageEmbed()
          .setAuthor(`${user.username}'s Profile`)
          .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
          .setColor(bot.colors.main)
          .setDescription([`**Created:** ${new Date(user.createdTimestamp).toLocaleString().split(" ")[0].replace(/\,/g, "")}`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Could not find that user.**`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    let member;
    try {
      member = message.guild.members.cache.get(message.author.id) || await message.guild.members.fetch(message.author.id);
    } catch (e) { }
    let boosting;
    if (member.premiumSince === null) {
      boosting = bot.translate(bot, language, "false");
    } else {
      boosting = bot.translate(bot, language, "myinfo.boost")
        .replace(/{SINCE}/g, member.premiumSince);
    }
    let rolesarray = []
    let roles = member.roles.cache.keyArray();
    roles.forEach(role => {
      rolesarray.push(message.guild.roles.cache.get(role));
    })
    rolesarray.pop();
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "myinfo.title")
        .replace(/{USERNAME}/g, bot.users.cache.get(member.id).username))
      .setThumbnail(bot.users.cache.get(member.id).displayAvatarURL({ format: "png", dynamic: true }))
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "myinfo.description").join("\n")
        .replace(/{USER}/g, message.author)
        .replace(/{NICKNAME}/g, member.nickname === null ? bot.translate(bot, language, "none") : member.nickname)
        // .replace(/{STATUS}/g, member.presence.status)
        .replace(/{JOINED}/g, new Date(member.joinedTimestamp).toLocaleString().split(" ")[0].replace(/\,/g, ""))
        .replace(/{CREATED}/g, new Date(message.author.createdTimestamp).toLocaleString().split(" ")[0].replace(/\,/g, ""))
        .replace(/{BOOSTING}/g, boosting)
        .replace(/{ROLES}/g, rolesarray.join("\n")))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
  }
}  