const { MessageEmbed } = require("discord.js");
const aki = require('aki-api');
module.exports = {
  aliases: ["aki"],
  category: "FUN",
  description: "Akinator - Mind Reading Game - This game does not work properly all the time and may not be updated",
  emoji: "📦",
  name: "akinator",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    if (!subcommand) {
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "akinator.help.title").replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.gold)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(bot.translate(bot, language, `akinator.help.${message.member.hasPermission("ADMINISTRATOR") ? "administrator" : "user"}`).join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{WARNING}/g, bot.emoji.warning)
          .replace(/{INVITE}/g, bot.invite))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    if (subcommand === "start") {
      if (bot.playingakinator.has(message.author.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "akinator.alreadyplaying")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let defaultobject = {
        guildid: message.guild.id,
        channelid: message.channel.id,
        region: "en",
        session: 0,
        signature: 0,
        step: 0
      }
      bot.playingakinator.set(message.author.id, defaultobject);
      startGame(bot, message, bot.playingakinator.get(message.author.id));
      //startGame(bot,message,0);
    } else if (subcommand === "stop") {
    } else if (message.member.hasPermission("ADMINISTRATOR") && subcommand === "setlanguage") {
    } else if (message.member.hasPermission("ADMINISTRATOR") && subcommand === "setchannel") {
    } else if (message.member.hasPermission("ADMINISTRATOR") && subcommand === "toggle") {
    } else {
      let embed = new MessageEmbed()
        //   .setAuthor(bot.translate(bot,language,"akinator.title").replace(/{BOTNAME}/g,bot.user.username))
        .setColor(bot.colors.gold)
        .setDescription(bot.translate(bot, language, `akinator.help.${message.member.hasPermission("ADMINISTRATOR") ? "administrator" : "user"}`).join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{WARNING}/g, bot.emoji.warning)
          .replace(/{INVITE}/g, bot.invite))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    async function startGame(bot, message, object) {
      let akiGame = new aki.Aki("en");
      akiGame.start().then(x => {
        //console.log(akiGame)
        object.game = akiGame;
        object.session = akiGame.session
        object.signature = akiGame.signature
        object.frontAddr = akiGame.frontAddr
        object.challenge_auth = akiGame.challenge_auth
        askQuestion(bot, message, object, akiGame);
      }).catch(e => {
        bot.playingakinator.delete(message.author.id);
        message.channel.send(`${bot.emoji.cross} Couldn't start a new game! :(`).catch(e => { });
      })
    }
    async function sendGuess(bot, message, object, akiGame, index) {
      if (index >= akiGame.answers.length) {
        // console.log(akiGame.answers)
        bot.playingakinator.delete(message.author.id)
        return message.channel.send(bot.translate(bot, language, "akinator.sendguess").replace(/{ANSWERS}/g, akiGame.answers.length)).catch(e => { });
      }
      let guess = akiGame.answers[index];
      let embed = new MessageEmbed()
        .setColor("#f5e325")
        .setTitle(`You are thinking about..`)
        .setThumbnail("https://4.bp.blogspot.com/_o40I1NXKJF8/SwKggPivX_I/AAAAAAAAEVU/sesarvVjhLM/s1600/akinator.png")
        .setDescription(`**${guess.name}**\n\\🏆 **Did i guess${index === 0 ? "" : " now"}?**\nType \`yes\` or \`no\``)
        .setFooter(`Progress ${Math.round(akiGame.progress)}%`)
        .setImage(guess.absolute_picture_path)
      message.channel.send(embed).then(guessMessage => {
        const filter = m => m.author.id === message.author.id && m.content && ["yes", "no"].includes(m.content.toLowerCase())
        guessMessage.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
          if (collected.first().content.toLowerCase() === "yes") {
            embed.setDescription(`**${guess.name}**\n\\🏆 **I KNEW IT!**`)
            bot.playingakinator.delete(message.author.id);
            console.log("Finished Akinator")
            guessMessage.edit(embed);
          } else {
            sendGuess(bot, message, object, akiGame, index + 1);
          }
        }).catch(e => {
          bot.playingakinator.delete(message.author.id);
        });
      }).catch(e => {
        message.channel.send(bot.translate(bot, language, "akinator.nomoreembeds").replace(/{GUESS}/g, guess.name)).catch(e => { });
        bot.playingakinator.delete(message.author.id);
      })
    }
    async function guessGame(bot, message, object, akiGame) {
      await akiGame.win().then(x => {
        let index = 0;
        sendGuess(bot, message, object, akiGame, index);
      }).catch(e => {
        bot.playingakinator.delete(message.author.id);
        return bot.error(bot, message, language, e);
      })
    }
    let answersInverse = {
      "y": 0,
      "n": 1,
      "d": 2,
      "p": 3,
      "pn": 4
    }
    let akiimages = [
      "https://i.pinimg.com/originals/69/66/a7/6966a739ce2ad4aa4d510f1350f8a011.png",
      "https://i.pinimg.com/originals/01/86/a2/0186a243e2bc6cad141e35177c3f5eec.png",
      "https://i.pinimg.com/originals/e6/e9/c9/e6e9c96ed36c597a68a2e2d9d4547392.png"
    ]
    let options = "**y**: Yes | **n**: No | **d**: Don't know\n**p**: Probably | **pn**: Probably not"
    async function askQuestion(bot, message, object, akiGame) {
      if (akiGame.progress > 98 || akiGame.currentStep >= 90) {
        return guessGame(bot, message, object, akiGame);
      }
      let embed = new MessageEmbed()
        .setColor("#f5e325")
        .setTitle(`${akiGame.question} (#${akiGame.currentStep + 1})`)
        .setThumbnail(akiimages[Math.floor(Math.random() * akiimages.length)])
        .setDescription(options)
        .setFooter(`Progress ${Math.round(akiGame.progress)}%`)
      let allowed = Object.keys(answersInverse);
      message.channel.send(embed).then(m => {
        const filter = m => m.author.id === message.author.id && m.content && allowed.includes(m.content.toLowerCase());
        m.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ["time"] }).then(collected => {
          let reply = answersInverse[collected.first().content.toLowerCase()];
          akiGame.step(reply).then(x => {
            askQuestion(bot, message, object, akiGame);
          }).catch(e => {
            bot.playingakinator.delete(message.author.id);
            return bot.error(bot, message, language, e);
          })
        }).catch(e => {
          bot.playingakinator.delete(message.author.id);
          return message.channel.send(`⏰ You never replied!`).catch(e => { return bot.error(bot, message, language, e); });
        })
      });
    }
    async function startGame3(bot, message, i) {
      let servers = ['en', 'en2', 'en3', 'en_object', 'en_animals',
        'ar', 'cn', 'de', 'de_animals', 'es', 'es_animals', 'fr', 'fr_objects', 'fr_animals',
        'il', 'it', 'it_animals', 'jp', 'jp_animals', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr']
      if (i > servers.length - 1) {
        bot.playingakinator.delete(message.author.id)
        message.channel.send("NONE OF THE SERVERS WORK!!")
        return console.log("NONE OF THE SERVERS WORK!!")
      }
      try {
        let data = await aki.start(servers[i]);
        message.channel.send(`[AKINATOR] ${servers[i]} WORKS!`);
        console.log(`[AKINATOR] ${servers[i]} WORKS!`);
        console.log(data);
      } catch (e) {
        message.channel.send(`[AKINATOR] ${servers[i]} server is not working!`);
        console.log(`[AKINATOR] ${servers[i]} server is not working!`);
        i = i + 1;
        startGame(bot, message, i);
      }
    }
    async function startGame2(bot, message, object) {
      try {
        let data = await aki.start("en3");
        console.log(data);
      } catch (e) {
        console.log(e);
        bot.playingakinator.delete(message.author.id);
      }
    }
  }
}