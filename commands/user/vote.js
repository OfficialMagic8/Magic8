const { MessageEmbed } = require("discord.js");
const votelinks = [
  "[**top.gg**](https://top.gg/bot/484148705507934208/vote)",
  "[**Discord Boats**](https://discord.boats/bot/484148705507934208/vote)",
  "[**Discord Bot List**](https://discordbotlist.com/bots/magic8/upvote)",
  "[**Discord Extreme List**](https://discordextremelist.xyz/en-US/bots/484148705507934208)",
  "[**Discord Bot Labs**](http://dbots.cc/magic8)",
  "[**Arcane Center**](https://arcane-center.xyz/bot/484148705507934208)",
  "[**botlist.space**](https://botlist.space/bot/484148705507934208)",
  "[**BladeBotList**](https://bladebotlist.xyz/bot/484148705507934208)",
  "[**Bots For Discord**](https://botsfordiscord.com/bot/484148705507934208)",
  "[**BotsDataBase**](https://botsdatabase.com/bot/484148705507934208)",
  "[**Blist**](https://blist.xyz/bot/484148705507934208)"
]
module.exports = {
  aliases: ["v"],
  category: "USER",
  description: "Vote and support Magic8 on TOP.GG!",
  emoji: "💎",
  name: "vote",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "vote.title")
        .replace(/{BOTNAME}/g, bot.user.username))
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "vote.description").join("\n")
        .replace(/{BOT}/g, bot.user)
        .replace(/{LINKS}/g, votelinks.map(v => `**•** ${v}`).join("\n")));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
  }
}