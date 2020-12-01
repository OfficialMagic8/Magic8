const { MessageEmbed } = require("discord.js");
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const gameline =
  "\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b {ONE} \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \n" +
  "\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b {TWO} \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \n" +
  "\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b {THREE} \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b "
const emotesname = { "0️⃣": 0, "1⃣": 1, "2⃣": 2, "3⃣": 3, "4⃣": 4, "5⃣": 5, "6⃣": 6, "7⃣": 7, "8⃣": 8, "9⃣": 9 }
const emotesnamerev = { 0: "0️⃣", 1: "1⃣", 2: "2⃣", 3: "3⃣", 4: "4⃣", 5: "5⃣", 6: "6⃣", 7: "7⃣", 8: "8⃣", 9: "9⃣" }
// const emotesname2 = { "0️⃣": 0, "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7, "8️⃣": 8, "9️⃣": 9 }
// const emotesnamerev2 = { 0: "0️⃣", 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣" }
const emotes = {/*0:"\u0030\u20E3",*/1: "\u0031\u20E3", 2: "\u0032\u20E3", 3: "\u0033\u20E3", 4: "\u0034\u20E3", 5: "\u0035\u20E3", 6: "\u0036\u20E3", 7: "\u0037\u20E3", 8: "\u0038\u20E3", 9: "\u0039\u20E3" }
// const emotesrev = {/*"\u0030\u20E3":0,*/"\u0031\u20E3": 1, "\u0032\u20E3": 2, "\u0033\u20E3": 3, "\u0034\u20E3": 4, "\u0035\u20E3": 5, "\u0036\u20E3": 6, "\u0037\u20E3": 7, "\u0038\u20E3": 8, "\u0039\u20E3": 9 }
module.exports = {
  emoji: "#️⃣",
  name: "tictactoe",
  aliases: ["michi", "ttt"],
  category: "MINIGAME",
  description: "Play TicTacToe with friends or Magic8.",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target;
    if (bot.playingtictactoe.has(message.author.id)) {
      let error = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "tictactoe.alreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e);});
    }
    try {
      let id = args[0].replace(/[^0-9]/g, "");
      target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
    } catch (e) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e);});
    }
    if (!target) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e);});
    }
    if (message.author.id === target.id) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "tictactoe.cannotbeauthor")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => {return bot.error(bot, message, language, e); });
    }
    if (bot.playingtictactoe.has(target.id)) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "tictactoe.targetalreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => {return bot.error(bot, message, language, e); });
    }
    let now = Date.now();
    let first = {
      guildid: message.guild.id,
      channelid: message.channel.id,
      start: now,
      user: message.author,
      userid: message.author.id,
      target: target.user,
      targetid: target.id,
      turns: 0,
      game: [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ],
      turn: 0
    }
    let second = {
      guildid: message.guild.id,
      channelid: message.channel.id,
      start: now,
      user: target.user,
      userid: target.id,
      target: message.author,
      targetid: message.author.id,
      turn: 0
    }
    bot.playingtictactoe.set(message.author.id, first);
    bot.playingtictactoe.set(target.id, second);
    startTicTacToe(bot, language, message.channel, first, second);
    async function startTicTacToe(bot, language, channel, first, second) {
      let loadingdescription = bot.translate(bot, language, "tictactoe.game.loadingdescription").join("\n");
      let gamedescription = bot.translate(bot, language, "tictactoe.game.description").join("\n");
      let game = first.game.map((a) => {
        if (a === "o") return "⭕"
        else if (a === "x") return "❌"
        else return emotes[a]
      })
      game = gameline.replace(/{ONE}/g, game.slice(0, 3).join("")).replace(/{TWO}/g, game.slice(3, 6).join("")).replace(/{THREE}/g, game.slice(6).join(""));
      let gameEmbed = new MessageEmbed()
        .setDescription(loadingdescription.replace(/{LOADING}/g, bot.emoji.loading)
          .replace(/{GAME}/g, game)
          .replace(/{CIRCLE}/g, first.user.username)
          .replace(/{CROSS}/g, second.user.username))
        .setColor(bot.colors.yellow)
      let gameMessage;
      try {
        gameMessage = await channel.send(gameEmbed);
      } catch (e) {
        console.error(e)
        bot.playingtictactoe.delete(first.user.id);
        bot.playingtictactoe.delete(second.user.id);
        sendUnexpectedError(bot, language, channel, first);
        return;
      }
      try {
        for (let code of Object.values(emotes)) {
          await gameMessage.react(code).catch(e => { console.error(e) });
        }
      } catch (e) {
        console.error(e)
        bot.playingtictactoe.delete(first.user.id);
        bot.playingtictactoe.delete(second.user.id);
        sendUnexpectedError(bot, language, channel, first);
      }
      let starter = Math.floor(Math.random() * 101) < 50 ? 0 : 1;
      first.turn = starter;
      askMove(bot, language, gameEmbed, gameMessage, gamedescription, channel, first, second, true)
    }
    function askMove(bot, language, gameEmbed, gameMessage, gamedescription, channel, first, second, reacted) {
      let game = first.game.map((a) => {
        if (a === "o") return "⭕"
        else if (a === "x") return "❌"
        else return emotes[a]
      })
      let lastwasbot = first.turn === 0 ? (second.user.bot) : (first.user.bot)
      let actualisbot = first.turn === 0 ? (first.user.bot) : (second.user.bot)

      game = gameline.replace(/{ONE}/g, game.slice(0, 3).join(""))
        .replace(/{TWO}/g, game.slice(3, 6).join(""))
        .replace(/{THREE}/g, game.slice(6).join(""));
      let toplay = first.turn === 0 ? first.user : second.user
      gameEmbed.setColor(first.turn === 0 ? bot.colors.lightred : bot.colors.lightblue)
      if (reacted) {
        if (actualisbot) {
          gameEmbed.setDescription(bot.translate(bot, language, "tictactoe.game.botdescription").join("\n")
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username)
            .replace(/{TURN}/g, toplay)
            .replace(/{GAME}/g, game)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username))
        } else {
          gameEmbed.setDescription(gamedescription.replace(/{TURN}/g, toplay)
            .replace(/{GAME}/g, game)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username))
        }
      } else {
        if (actualisbot) {
          gameEmbed.setDescription(bot.translate(bot, language, "tictactoe.game.botdescription").join("\n")
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username)
            .replace(/{TURN}/g, toplay)
            .replace(/{GAME}/g, game)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username))
        } else {
          if (lastwasbot) {
            gameEmbed.setDescription(gamedescription
              .replace(/{TURN}/g, toplay)
              .replace(/{GAME}/g, game)
              .replace(/{LOADING}/g, bot.emoji.loading)
              .replace(/{CIRCLE}/g, first.user.username)
              .replace(/{CROSS}/g, second.user.username))
          } else {
            gameEmbed.setDescription(bot.translate(bot, language, "tictactoe.game.description").join("\n")
              .replace(/{LOADING}/g, bot.emoji.loading)
              .replace(/{TURN}/g, toplay)
              .replace(/{GAME}/g, game)
              .replace(/{CIRCLE}/g, first.user.username)
              .replace(/{CROSS}/g, second.user.username))
          }
        }
      }
      gameMessage.edit(gameEmbed).then(async m => {
        let availablenumbers = first.game.filter(a => !["o", "x"].includes(a))
        let availablereactions = availablenumbers.map(n => emotesnamerev[n]);
        let filter = (reaction, user) => !user.bot && user.id === toplay.id && availablereactions.includes(reaction.emoji.name);
        reacted = false;
        let number;
        try {
          let collected = await gameMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
          reacted = true;
          let reaction = collected.first();
          let emoji = reaction.emoji.name;
          reaction.remove(toplay).catch(e => { });
          number = emotesname[emoji];
        } catch (e) {
          reacted = false;
          number = availablenumbers[Math.floor(Math.random() * availablenumbers.length)]
        }
        first.game[number - 1] = first.turn == 0 ? "o" : "x"
        first.turns = first.turns + 1
        let winner = getWinner(bot, first);
        if (winner) {
          // console.log(`#️⃣[🏆] ${toplay.tag} won against ${first.turn == 0 ? second.user.tag : first.user.tag}!`)
          let game = first.game.map((a) => {
            if (a === "o") return "⭕"
            else if (a === "x") return "❌"
            else return emotes[a]
          })
          game = gameline.replace(/{ONE}/g, game.slice(0, 3).join(""))
            .replace(/{TWO}/g, game.slice(3, 6).join(""))
            .replace(/{THREE}/g, game.slice(6).join(""));
          gameEmbed.setDescription(bot.translate(bot, language, "tictactoe.game.winnerdescription").join("\n")
            .replace(/{GAME}/g, game)
            .replace(/{WINNER}/g, toplay)
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username))
            .setColor(bot.colors.blue)
          gameMessage.edit(gameEmbed).then(m => {
            m.reactions.removeAll().catch(e => { console.error(e) })
            bot.playingtictactoe.delete(first.user.id);
            bot.playingtictactoe.delete(second.user.id);
          }).catch(e => {
            if (gameMessage) gameMessage.reactions.removeAll().catch(e => { console.error(e) })
            sendUnexpectedError(bot, language, channel, first);
            console.error(e)
          });
          return;
        }
        if (first.turns >= 9) {
          // console.log(`#️⃣[⌛] DRAW between ${toplay.tag} and ${first.turn == 0 ? second.user.tag : first.user.tag}!`)
          let game = first.game.map((a) => {
            if (a === "o") return "⭕"
            else if (a === "x") return "❌"
            else return emotes[a - 1]
          })
          game = gameline.replace(/{ONE}/g, game.slice(0, 3).join(""))
            .replace(/{TWO}/g, game.slice(3, 6).join(""))
            .replace(/{THREE}/g, game.slice(6).join(""));
          gameEmbed.setDescription(bot.translate(bot, language, "tictactoe.game.drawdescription").join("\n")
            .replace(/{GAME}/g, game)
            .replace(/{CROSS2}/g, bot.emoji.cross)
            .replace(/{CIRCLE}/g, first.user.username)
            .replace(/{CROSS}/g, second.user.username))
            .setColor(bot.colors.yellow)
          gameMessage.edit(gameEmbed).then(m => {
            m.reactions.removeAll().catch(e => { console.error(e) })
            bot.playingtictactoe.delete(first.user.id);
            bot.playingtictactoe.delete(second.user.id);
          }).catch(e => {
            if (gameMessage) gameMessage.reactions.removeAll().catch(e => { });
            console.error(e)
            sendUnexpectedError(bot, language, channel, first);
          });
          return;
        }
        first.turn = first.turn === 0 ? 1 : 0
        askMove(bot, language, gameEmbed, gameMessage, gamedescription, channel, first, second, reacted);
      }).catch(e => {
        console.error(e)
        if (gameMessage) gameMessage.reactions.removeAll().catch(e => { });
        bot.playingtictactoe.delete(first.user.id);
        bot.playingtictactoe.delete(second.user.id);
        sendUnexpectedError(bot, language, channel, first);
      });
    }
    function getWinner(bot, first) {
      let tocheck = first.turn == 0 ? "o" : "x"
      for (let entry of wins) {
        //console.log(`Checking: [${entry.join(",")}]`)
        if (first.game[entry[0]] === tocheck && first.game[entry[1]] === tocheck && first.game[entry[2]] === tocheck) {
          return true;
        }
      }
      return false;
    }
    function sendUnexpectedError(bot, language, channel, first) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "unexpectederror")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, first.user)
          .replace(/{INVITE}/g, bot.invite));
      return channel.send(embed).catch(e => { });
    }
  }
}