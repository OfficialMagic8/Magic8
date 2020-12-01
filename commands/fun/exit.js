const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  category: "FUN",
  description: "Disconnect from all games",
  emoji: "🎮",
  name: "exit",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (bot.battling.has(message.author.id) ||
      bot.playerhacked.has(message.author.id) ||
      bot.onthephone.has(message.author.id) ||
      bot.playing8color.has(message.author.id) ||
      bot.playingakinator.has(message.author.id) ||
      bot.playinganagrams.has(message.author.id) ||
      bot.playingconnect4.has(message.author.id) ||
      bot.playingfindme.has(message.author.id) ||
      bot.playingmallet.has(message.author.id) ||
      bot.playingslotmachine.has(message.author.id) ||
      bot.playingtictactoe.has(message.author.id) ||
      bot.playingtrivia.has(message.author.id) ||
      bot.spinningspinner.has(message.author.id)) {
      let exitEmbed = new MessageEmbed()
        .setColor(bot.colors.lightred)
        .setDescription([`${bot.emoji.warning} **${message.author}, you are about to disconnect from all games you might be in!**`,
          `*If you really wish to leave, click ✅ within 20 seconds.*`])
      let exitMessage;
      try {
        exitMessage = await message.channel.send(exitEmbed)
      } catch (e) {
        let error = new MessageEmbed()
          .setDescription(`${bot.emoji.cross} **${message.author}, there was an error disconnecting you from any games!**`)
          .setColor(bot.colors.red)
          .setFooter(bot.footer)
        return message.channel.send(error).catch(e => { })
      }
      setTimeout(async () => {
        exitMessage.react("✅").catch(e => { });
        let filter = (reaction, user) => !user.bot && user.id === message.author.id && reaction.emoji.name === "✅"
        let collected;
        collected = await exitMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ["time"] })
          .then(async collected => {
            if (bot.battling.has(message.author.id)) bot.battling.delete(message.author.id)
            if (bot.playerhacked.has(message.author.id)) bot.playerhacked.delete(message.author.id)
            if (bot.onthephone.has(message.author.id)) bot.onthephone.delete(message.author.id)
            if (bot.playing8color.has(message.author.id)) bot.playing8color.delete(message.author.id)
            if (bot.playingakinator.has(message.author.id)) bot.playingakinator.delete(message.author.id)
            if (bot.playinganagrams.has(message.author.id)) bot.playinganagrams.delete(message.author.id)
            if (bot.playingconnect4.has(message.author.id)) bot.playingconnect4.delete(message.author.id)
            if (bot.playingfindme.has(message.author.id)) bot.playingfindme.delete(message.author.id)
            if (bot.playingmallet.has(message.author.id)) bot.playingmallet.delete(message.author.id)
            if (bot.playingslotmachine.has(message.author.id)) bot.playingslotmachine.delete(message.author.id)
            if (bot.playingtictactoe.has(message.author.id)) bot.playingtictactoe.delete(message.author.id)
            if (bot.playingtrivia.has(message.author.id)) bot.playingtrivia.delete(message.author.id)
            if (bot.spinningspinner.has(message.author.id)) bot.spinningspinner.delete(message.author.id)
            let exitDescription = [
              `${bot.emoji.check} **You have been removed from all games!**`
            ]
            exitEmbed.setColor(bot.colors.green)
            exitEmbed.setDescription(exitDescription.join("\n"))
            try {
              await exitMessage.edit(exitEmbed)
              await exitMessage.reactions.removeAll().catch(e => { });
            } catch (e) {
              bot.playingcasino.delete(message.author.id);
              let error = new MessageEmbed()
                .setDescription(`${bot.emoji.cross} **${message.author}, there was an error disconnecting you from any games!**`)
                .setColor(bot.colors.red)
                .setFooter(bot.footer)
              return message.channel.send(error).catch(e => { })
            }
          }).catch(console.error)
      }, 1000)
    } else {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **${message.author}, you are not playing any games!**`)
      return message.channel.send(error).catch(e => { })
    }
  }
}