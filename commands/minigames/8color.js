const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["8c"],
  category: "MINIGAME",
  description: "Color Emoji Memory Game",
  emoji: "🎨",
  name: "8color",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let removemessage = false;
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.playing8color.has(message.author.id)) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "8color.alreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross).
          replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let defaultObject = {
      level: 1,
      channelid: message.channel.id,
      guildid: message.guild.id,
      original: "none",
      correct: "none"
    }
    bot.playing8color.set(message.author.id, defaultObject);
    startGame(bot, message, guildData.colorgameremovemessage === 1 ? true : false, language);
    async function startGame(bot, message, removemessage, language) {
      let object = bot.playing8color.get(message.author.id);
      let amount = 4 + Math.floor(object.level / 2)
      let randomColors = bot.utils.getRandomColors(bot, amount);
      object.original = randomColors.original;
      object.correct = randomColors.correct;
      // console.log(`⬛ ${message.author.tag}: ${object.original}`)
      let timeMemorize = 10000 + ((Math.ceil(object.level / 2) - 1) * 1000)
      let timeMemorizeShort = (timeMemorize / 1000).toFixed(0);
      let game = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "8color.game.playing.title")
          .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setDescription(bot.translate(bot, language, "8color.game.playing.description").join("\n")
          .replace(/{LOADING}/g, bot.emoji.loading)
          .replace(/{LEVEL}/g, object.level)
          .replace(/{PATTERN}/g, object.correct)
          .replace(/{TIME}/g, timeMemorizeShort))
        .setColor(bot.colors.main)
      let gameMessage = await message.channel.send(game).catch(e => {
        bot.playing8color.delete(message.author.id)
        return bot.error(bot, message, language, e);
      });
      setTimeout(async () => {
        let time = 15000 + ((Math.ceil(object.level / 2) - 1) * 1000)
        let timeshort = (time / 1000).toFixed(0);
        game.setDescription(bot.translate(bot, language, "8color.game.enterpattern.description").join("\n")
          .replace(/{LEVEL}/g, object.level)
          .replace(/{TIME}/g, timeshort))
          .setColor(bot.colors.yellow)
        try {
          await gameMessage.edit(game);
        } catch (e) {
          bot.error(bot, message, language, e);
        }
        let filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter, { max: 1, time: time, errors: ['time'] }).then(async collected => {
          let replyMessage = collected.first()
          let reply = replyMessage.content.split(" ").join("");
          if (reply === object.original) {
            console.log(`⬛[✔️] ${message.author.tag} answered correctly ${reply}! Streak: ${object.level}`)
            object.level = object.level + 1;
            game.setDescription(bot.translate(bot, language, "8color.game.win.description").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{LEVEL}/g, object.level))
              .setColor(bot.colors.green)
            try {
              await gameMessage.edit(game);
              setTimeout(async () => {
                if (removemessage) {
                  gameMessage.delete({ timeout: 500 }).catch(e => { });
                  replyMessage.delete({ timeout: 500 }).catch(e => { });
                }
                startGame(bot, message, removemessage, language)
              }, 10000)
            } catch (e) {
              bot.error(bot, message, language, e);
            }
            if (removemessage) replyMessage.delete({ timeout: 500 }).catch(e => { });
          } else {
            console.log(`⬛[❌] ${message.author.tag} answered incorrectly! Correct: ${object.original}| Given: ${reply} | Streak: ${object.level - 1}`)
            bot.playing8color.delete(message.author.id)
            game.setAuthor(bot.translate(bot, language, "8color.game.lose.title")
              .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: true }))
              .setDescription(bot.translate(bot, language, "8color.game.lose.description").join("\n")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{PATTERN}/g, object.original)
                .replace(/{REPLY}/g, reply)
                .replace(/{LEVEL}/g, object.level))
              .setColor(bot.colors.red)
            try {
              await gameMessage.edit(game);
              if (removemessage) replyMessage.delete({ timeout: 500 }).catch(e => { });
              if (removemessage) gameMessage.delete({ timeout: 10000 }).catch(e => { });
            } catch (e) {
              bot.error(bot, message, language, e);
            }
          }
        }).catch(async e => {
          console.log(`⬛[⏰] ${message.author.tag} time out! Correct: ${object.original} | Streak: ${object.level - 1}`)
          bot.playing8color.delete(message.author.id)
          game.setAuthor(bot.translate(bot, language, "8color.game.lose.title")
            .replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(bot.translate(bot, language, "8color.game.lose.descriptiontimeout").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{PATTERN}/g, object.original)
              .replace(/{LEVEL}/g, object.level))
            .setColor(bot.colors.red)
          try {
            await gameMessage.edit(game);
            if (removemessage) gameMessage.delete({ timeout: 10000 }).catch(e => { });
          } catch (e) {
            bot.error(bot, message, language, e);
          }
        })
      }, timeMemorize);
    }
  }
}