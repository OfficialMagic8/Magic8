const { MessageEmbed } = require("discord.js");
const firstline = "\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣"
const format = "\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b {LINE}"
const emotesname = { "1⃣": 1, "2⃣": 2, "3⃣": 3, "4⃣": 4, "5⃣": 5, "6⃣": 6, "7⃣": 7, "8⃣": 8 }
const emotesnamerev = { 1: "1⃣", 2: "2⃣", 3: "3⃣", 4: "4⃣", 5: "5⃣", 6: "6⃣", 7: "7⃣", 8: "8⃣" }
const emotes = {/*0:"\u0030\u20E3",*/1: "\u0031\u20E3", 2: "\u0032\u20E3", 3: "\u0033\u20E3", 4: "\u0034\u20E3", 5: "\u0035\u20E3", 6: "\u0036\u20E3", 7: "\u0037\u20E3", 8: "\u0038\u20E3"/*,9:"\u0039\u20E3"*/ }
module.exports = {
  aliases: ["cf", "c4"],
  category: "MINIGAME",
  description: "Play Connect4 with friends or Magic8",
  emoji: "🟡",
  name: "connectfour",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target;
    if (bot.playingconnect4.has(message.author.id)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "connectfour.alreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    try {
      let id = args[0].replace(/[^0-9]/g, "");
      target = bot.users.cache.get(id) || await bot.users.fetch(id);
    } catch (e) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (!target) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (message.author.id === target.id) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "connectfour.cannotyourself")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (bot.playingconnect4.has(target.id)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "connectfour.targetalreadyplaying")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let now = Date.now()
    let first = {
      user: message.author,
      userid: message.author.id,
      target: target.user,
      targetid: target.id,
      guildid: message.guild.id,
      channelid: message.channel.id,
      turn: 0,
      turns: 0,
      starttime: now,
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
    let second = {
      user: target.user,
      userid: target.id,
      target: message.author,
      targetid: message.author.id,
      guildid: message.guild.id,
      channelid: message.channel.id,
      turn: 0,
      turns: 0,
      starttime: now,
      board: []
    }
    bot.playingconnect4.set(message.author.id, first);
    bot.playingconnect4.set(target.id, second);
    startGame(bot, language, message.channel, first, second);

    async function startGame(bot, language, channel, first, second) {
      let loadingdescription = bot.translate(bot, language, "connectfour.game.loadingdescription").join("\n")
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{COLUMNS}/g, firstline)
        .replace(/{RED}/g, first.user)
        .replace(/{YELLOW}/g, second.user);
      let gamedescription = bot.translate(bot, language, "connectfour.game.description").join("\n")
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{COLUMNS}/g, firstline)
        .replace(/{RED}/g, first.user)
        .replace(/{YELLOW}/g, second.user);
      let game = first.board.map((row) => {
        return format.replace(/{LINE}/g, row.map((irow) => {
          if (irow === 0) return "⚫"
          else if (irow === 1) return "🔴"
          else return "🟡"
        }).join(""));
      }).join("\n")
      let connectEmbed = new MessageEmbed()
        .setAuthor(`Connect4`,
          "https://cdn.discordapp.com/emojis/701843940638457867.gif", null)
        .setDescription(loadingdescription.replace(/{LOADING}/g, bot.emoji.loading).replace(/{RED}/g, first.user).replace(/{YELLOW}/g, second.user).replace(/{GAME}/g, game))
        .setColor(bot.colors.yellow)
        .setFooter(bot.footer)
      // .setFooter(`${bot.footer} • Connect4`)
      let connectMessage;
      try {
        connectMessage = await channel.send(connectEmbed);
      } catch (e) {
        bot.playingconnect4.delete(first.userid);
        bot.playingconnect4.delete(second.userid);
        return bot.error(bot, message, language, e);
      }
      try {
        for (let code of Object.values(emotes)) {
          await connectMessage.react(code);
        }
      } catch (e) { }
      let starter = Math.floor(Math.random() * 101) < 50 ? 1 : 2;
      first.turn = starter;
      askMove(bot, language, connectEmbed, connectMessage, gamedescription, channel, first, second, true)
    }

    function askMove(bot, language, connectEmbed, connectMessage, gamedescription, channel, first, second, reacted) {
      let game = first.board.map((row) => {
        return format.replace(/{LINE}/g, row.map((irow) => {
          if (irow === 0) return "⚪"
          else if (irow === 1) return "🔴"
          else return "🟡"
        }).join(""));
      }).join("\n")
      let toplay = first.turn === 1 ? first.user : second.user
      connectEmbed.setColor(first.turn === 1 ? bot.colors.connectred : bot.colors.connectyellow)
      if (reacted) {
        connectEmbed.setDescription(gamedescription.replace(/{TURN}/g, toplay)
          .replace(/{GAME}/g, game)
          .replace(/{LOADING}/g, bot.emoji.loading))
      } else {
        connectEmbed.setDescription(bot.translate(bot, language, "connectfour.game.autodescription").join("\n")
          .replace(/{COLUMNS}/g, firstline)
          .replace(/{RED}/g, first.user)
          .replace(/{YELLOW}/g, second.user)
          .replace(/{LASTTURN}/g, first.turn === 1 ? second.user : first.user)
          .replace(/{LOADING}/g, bot.emoji.loading)
          .replace(/{TURN}/g, toplay)
          .replace(/{GAME}/g, game)
          .replace(/{LOADING}/g, bot.emoji.loading))
      }
      connectMessage.edit(connectEmbed).then(async m => {
        let availablecolumns = getAvailableColums(first.board);
        let availablereactions = availablecolumns.map(n => emotesnamerev[n + 1]);
        let filter = (reaction, user) => !user.bot && user.id === toplay.id && availablereactions.includes(reaction.emoji.name);
        reacted = false;
        let column;
        let showncolumn;
        try {
          let collected = await connectMessage.awaitReactions(filter, { max: 1, time: 15000, errors: ["time"] })
          reacted = true;
          let reaction = collected.first();
          let emoji = reaction.emoji.name;
          reaction.users.remove(toplay).catch(e => { });
          column = emotesname[emoji] - 1;
          showncolumn = emotesname[emoji]
          // console.log(`Reaction fired | Column: ${column} | Shown column ${showncolumn} | Reaction: ${emoji}`)
        } catch (e) {
          reacted = false;
          column = availablecolumns[Math.floor(Math.random() * availablecolumns.length)]
          showncolumn = column + 1
          // console.log(`Random move fired | Column: ${column} | Shown column ${showncolumn} | Reaction: ${emotesnamerev[showncolumn]}`)
        } // have you made a check if the column is filled up with red/yellow?
        let highestAllowed = getHighestAllowedRow(first.board, column);
        // console.log(`Highest row index: ${highestAllowed}`)
        first.board[5 - highestAllowed][column] = first.turn;
        first.turns = first.turns + 1
        let winner
        if (first.turns >= 7) winner = getWinner(first.board, column);
        if (winner) {
          // console.log(`🟡[🏆] ${toplay.tag} won against ${first.turn === 1 ? second.user.tag : first.user.tag}!`)
          // console.log(winner)
          let object = arrayToObject(winner);
          // console.log(object)
          let columns = Object.keys(object);
          game = first.board.map((row, rindex) => {
            return format.replace(/{LINE}/g, row.map((irow, cindex) => {
              if (irow === 0) return "⚪"
              else if (irow === 1) return columns.includes(cindex + "") ? (object[cindex + ""].includes(rindex) ? bot.emoji.blinkingred : "🔴") : "🔴"
              else return columns.includes(cindex + "") ? (object[cindex + ""].includes(rindex) ? bot.emoji.blinkingyellow : "🟡") : "🟡"
            }).join(""));
          }).join("\n")
          connectEmbed.setDescription(bot.translate(bot, language, "connectfour.game.winnerdescription").join("\n")
            .replace(/{COLUMNS}/g, firstline)
            .replace(/{WINNER}/g, toplay)
            .replace(/{RED}/g, first.user)
            .replace(/{YELLOW}/g, second.user)
            .replace(/{GAME}/g, game)
            .replace(/{LOADING}/g, bot.emoji.loading));
          connectEmbed.setColor(first.turn === 1 ? bot.colors.red : bot.colors.yellow)
          connectMessage.edit(connectEmbed).then(m => {
            m.reactions.removeAll().catch(e => { });
            bot.playingconnect4.delete(first.user.id);
            bot.playingconnect4.delete(second.user.id);
          }).catch(e => {
            if (connectMessage) connectMessage.reactions.removeAll().catch(e => { });
            return bot.error(bot, message, language, e);
          });
          return;
        }
        if (first.turns >= 48) {
          game = first.board.map((row) => {
            return format.replace(/{LINE}/g, row.map((irow) => {
              if (irow === 0) return "⚪"
              else if (irow === 1) return "🔴"
              else return "🟡"
            }).join(""));
          }).join("\n")
          connectEmbed.setDescription(bot.translate(bot, language, "connectfour.game.drawdescription").join("\n")
            .replace(/{COLUMNS}/g, firstline)
            .replace(/{RED}/g, first.user)
            .replace(/{YELLOW}/g, second.user)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{GAME}/g, game))
            .setColor(bot.colors.blue)
          connectMessage.edit(connectEmbed).then(m => {
            m.reactions.removeAll().catch(e => { });
            bot.playingconnect4.delete(first.user.id);
            bot.playingconnect4.delete(second.user.id);
          }).catch(e => {
            if (connectMessage) connectMessage.reactions.removeAll().catch(e => { });
            return bot.error(bot, message, language, e);
          });
          return;
        }
        first.turn = first.turn === 1 ? 2 : 1
        askMove(bot, language, connectEmbed, connectMessage, gamedescription, channel, first, second, reacted);
      }).catch(e => {
        if (connectMessage) connectMessage.reactions.removeAll().catch(e => { });
        bot.playingtictactoe.delete(first.userid);
        bot.playingtictactoe.delete(second.userid);
        return bot.error(bot, message, language, e);
      });
    }
    function getWinner(board, col) {
      for (let row = 0; row <= 2; row++) {
        for (let col = 0; col <= 6; col++) {
          if (board[row][col] != 0 &&
            board[row][col] == board[row + 1][col] &&
            board[row][col] == board[row + 2][col] &&
            board[row][col] == board[row + 3][col])
            return [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
          //return board[row][col];
        }
      }
      for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 3; col++) {
          if (board[row][col] != 0 &&
            board[row][col] == board[row][col + 1] &&
            board[row][col] == board[row][col + 2] &&
            board[row][col] == board[row][col + 3])
            return [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]
          //return board[row][col];
        }
      }

      for (let col = 0; col <= 3; col++) {
        for (let row = 0; row <= 2; row++) {
          if (board[row][col] != 0 &&
            board[row][col] == board[row + 1][col + 1] &&
            board[row][col] == board[row + 2][col + 2] &&
            board[row][col] == board[row + 3][col + 3])
            return [[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]
          //return board[row][col];
        }
        for (let row = 3; row <= 5; row++) {
          if (board[row][col] != 0 &&
            board[row][col] == board[row - 1][col + 1] &&
            board[row][col] == board[row - 2][col + 2] &&
            board[row][col] == board[row - 3][col + 3])
            return [[row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]]
          //return board[row][col];
        }
      }
      return undefined;
    }
    function getAvailableColums(board) {
      return [0, 1, 2, 3, 4, 5, 6, 7].filter(column => getHighestAllowedRow(board, column) !== -1);
    }
    function getHighestAllowedRow(board, column) {
      let total = board.reduce((total, row) => {
        if (row[column] !== 0)
          return total += 1;
        return total;
      }, 0);
      if (total <= 5) return total;
      return -1;
    }
    function arrayToObject(array) {
      let object = {}
      array.forEach(entry => {
        if (!object[entry[1]]) {
          object[entry[1]] = [];
        }
        object[entry[1]].push(entry[0]);
      })
      return object;
    }
  }
}