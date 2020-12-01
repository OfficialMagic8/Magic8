const Discord = require("discord.js");
module.exports = {
  aliases: ["v"],
  category: "USER",
  description: "Vote and support Magic8 on TOP.GG!",
  emoji: "💎",
  name: "vote",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (message.author.id === bot.config.ownerid) {
      try {
        let votes = await bot.dbl.getVotes();
        let voted = [];
        votes.forEach(vote => {
          let o = {
            name: `${vote.username}#${vote.discriminator}`,
            votes: 1
          };
          voted.push(o);
        });
        let names = [];
        let final = [];
        for (let v of voted) {
          let repeats = voted.filter(i => i.name === v.name)
          names.push(v.name)
          if (names.filter(i => i === v.name).length <= 1) {
            final.push(`${v.name}: ${repeats.length}`)
          }
        }
        console.log(`DBL Voters This Month:\n${final.join("\n")}`)
      } catch (e) {
        console.error(e);
      }
      try {
        let votecount = await bot.boats.getBot(bot.user.id)
        console.log(`Discord Boats Total Votes This Month:\n${votecount.bot_vote_count.toLocaleString("en")}`)
      } catch (e) {
        console.error(e);
      }
    }
    let embed = new Discord.MessageEmbed()
      .setAuthor(bot.translate(bot, language, "vote.title")
        .replace(/{BOTNAME}/g, bot.user.username))
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "vote.description").join("\n")
        .replace(/{BOT}/g, bot.user)
        .replace(/{VOTE1}/g, bot.config.vote.dbl))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
  }
}