const { MessageEmbed, Collection } = require("discord.js");
const categories = new Collection();
categories.set("general", 9)
categories.set("books", 10)
categories.set("films", 11)
categories.set("music", 12)
categories.set("musicals", 13)
categories.set("theatres", 13)
categories.set("television", 14)
categories.set("video games", 15)
categories.set("board games", 16)
categories.set("science", 17)
categories.set("nature", 17)
categories.set("computers", 18)
categories.set("mathematics", 19)
categories.set("mythology", 20)
categories.set("sports", 21)
categories.set("geography", 22)
categories.set("history", 23)
categories.set("politics", 24)
categories.set("art", 25)
categories.set("celebrities", 26)
categories.set("animals", 27)
categories.set("vehicles", 28)
categories.set("comics", 29)
categories.set("gadgets", 30)
categories.set("anime", 31)
categories.set("manga", 31)
categories.set("cartoon", 32)
categories.set("animations", 32)
const request = require("request");
const baseurl = 'https://opentdb.com/api.php?amount=1&encode=url3986'
const categorybaseurl = 'https://opentdb.com/api.php?amount=1&category={CATEGORY}&difficulty={DIFFICULTY}&encode=url3986';
module.exports = {
  aliases: ["triv"],
  category: "MINIGAMES",
  description: "Play Random Trivia - Others can help you but only you can answer",
  emoji: "🔠",
  name: "trivia",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.playingtrivia.has(message.author.id)) {
      let object = bot.playingtrivia.get(message.author.id)
      if (message.channel.id !== object.channelid) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "trivia.alreadyplaying")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { })
      } else return;
    }
    let object;
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "trivia.info").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INFO}/g, bot.emoji.info))
      return message.channel.send(embed).catch(e => { })
    }
    if (args[0].toLowerCase() === "categories" && !args[1]) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "trivia.categories").join("\n")
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{CATEGORIES}/g, categories.keyArray().map(c => `\`${c}\``).join(" ")))
      return message.channel.send(embed).catch(e => { })
    }
    if (args[0].toLowerCase() === "start" && !args[1]) {
      object = {
        guildid: message.guild.id,
        channelid: message.channel.id,
        difficulty: "any",
        category: 0,
        streak: 0
      }
    }
    let modes = ["easy", "medium", "hard"];
    if (!args[1] && !["start", "categories"].includes(args[0].toLowerCase()) && !modes.includes(args[0].toLowerCase())) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "trivia.invaliddifficulty").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{DIFFICULTIES}/g, modes.map(c => `\`${c}\``).join(" ")))
      return message.channel.send(embed).catch(e => { })
    }
    if (!args[1] && modes.includes(args[0].toLowerCase())) {
      object = {
        guildid: message.guild.id,
        channelid: message.channel.id,
        difficulty: args[0].toLowerCase(),
        category: 0,
        streak: 0
      }
    }
    if (args[1]) {
      let catestring = args.slice(1).join(" ").toLowerCase();
      modes.push("any")
      if (!modes.includes(args[0].toLowerCase())) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "trivia.invaliddifficulty2").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{DIFFICULTIES}/g, modes.map(c => `\`${c}\``).join(" ")))
        return message.channel.send(embed).catch(e => { })
      }
      if (modes.includes(args[0].toLowerCase())) {
        if (!catestring || !categories.has(catestring)) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "trivia.invalidcategory").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{CATEGORIES}/g, categories.keyArray().map(c => `\`${c}\``).join(" ")))
          return message.channel.send(embed).catch(e => { })
        }
        object = {
          guildid: message.guild.id,
          channelid: message.channel.id,
          difficulty: args[0].toLowerCase(),
          category: categories.get(catestring),
          streak: 0
        }
      }
    }
    bot.playingtrivia.set(message.author.id, object);
    startTriviaGame(bot, message.channel, message.author, language, object);
    function startTriviaGame(bot, channel, user, language, object) {
      let difficulty;
      if (object.difficulty === "any") {
        if (object.streak < 5) {
          difficulty = "easy";
        } else if (object.streak < 15) {
          difficulty = "medium";
        } else {
          difficulty = "hard";
        }
      } else {
        difficulty = object.difficulty
      }
      let link = categorybaseurl.replace(/{CATEGORY}/g, object.category).replace(/{DIFFICULTY}/g, difficulty)
      request(link, function (err, response, body) {
        if (err) {
          return bot.error(bot, message, language, err);
        }
        let parsed = JSON.parse(body);
        let result = parsed.results[0];
        let correctanswer = stringFix(result.correct_answer)
        // console.log(`${user.tag}: ${correctanswer}`);
        let incorrectanswers = arrayFix(result.incorrect_answers.slice());
        let options = incorrectanswers.slice()
        options.push(correctanswer)
        let suffleoptions = shuffle(options)
        let optionnumber = 1
        let shownoptions = []
        let correctanswers = [correctanswer.trim().toLowerCase()]
        suffleoptions.map(ques => {
          if (correctanswer.trim() === ques.trim()) correctanswers.push(optionnumber.toString())
          shownoptions.push(`${optionnumber}) ${ques}`)
          optionnumber++;
        });
        let category = stringFix(result.category);
        let subcategory = "";
        if (category.includes(":")) {
          subcategory = bot.translate(bot, language, "trivia.trivia.subcategory")
            .replace(/{SUBCATEGORY}/g, stringFix(category.split(":")[1]))
          category = stringFix(category.split(":")[0]);
        }
        let difficulty = capitalizeFirstLetter(stringFix(result.difficulty))
        let question = stringFix(result.question)
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "trivia.trivia.title")
            .replace(/{USERNAME}/, user.username), user.displayAvatarURL({ format: "png", dynamic: true }))
          .setThumbnail("https://i.imgur.com/WTCMRFb.png")
          .setDescription(bot.translate(bot, language, "trivia.trivia.description").join("\n")
            .replace(/{CATEGORY}/g, category)
            .replace(/{SUBCATEGORYSTRING}/g, subcategory)
            .replace(/{DIFFICULTY}/g, difficulty)
            .replace(/{QUESTION}/g, question)
            .replace(/{OPTIONS}/g, shownoptions.join("\n")))
          .setColor(bot.colors.trivia.start);
        channel.send(embed).then(triviaembed => {
          const filter = m => m.author.id === user.id && m.content;
          channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
            .then(collected => {
              let useranswer = collected.first()
              if (correctanswers.includes(useranswer.content.trim().toLowerCase())) {
                // console.log(`🔠[✔️] ${user.tag} answered correctly: ${correctanswer}`)
                useranswer.delete({ timeout: 5000 }).catch(e => { });
                triviaembed.delete({ timeout: 60000 }).catch(e => { });
                object.streak = object.streak + 1;
                let correct = new MessageEmbed()
                  .setColor(bot.colors.green)
                  .setDescription(bot.translate(bot, language, "trivia.correct").join("\n")
                    .replace(/{CHECK}/g, bot.emoji.check)
                    .replace(/{USER}/g, user)
                    .replace(/{STREAK}/g, object.streak)
                    .replace(/{ANSWER}/g, correctanswer))
                channel.send(correct).then(async m => {
                  setTimeout(() => {
                    m.delete().catch(e => { });
                    startTriviaGame(bot, channel, user, language, object);
                  }, 10000);
                }).catch(e => { });
                return;
              } else {
                // console.log(`🔠[❌] ${user.tag} answered incorrectly: ${correctanswer} - Given: ${useranswer.content.trim()}`)
                useranswer.delete({ timeout: 5000 }).catch(e => { });
                triviaembed.delete({ timeout: 60000 }).catch(e => { });
                bot.playingtrivia.delete(user.id)
                let incorrect = new MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "trivia.incorrect").join("\n")
                    .replace(/{USER}/g, user)
                    .replace(/{STREAK}/g, object.streak)
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{CORRECTANSWER}/g, correctanswer)
                    .replace(/{INCORRECTANSWER}/g, useranswer.content.trim()))
                channel.send(incorrect).catch(e => { });
              }
            }).catch(collected => {
              // console.log(`🔠[⏰] ${user.tag} time's up. Correct answer: ${correctanswer}`)
              triviaembed.delete({ timeout: 60000 }).catch(e => { });
              bot.playingtrivia.delete(user.id)
              let timeout = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "trivia.timeout").join("\n")
                  .replace(/{USER}/g, user)
                  .replace(/{STREAK}/g, object.streak))
              channel.send(timeout).catch(e => { });
            });
        }).catch(e => { });
      });
    }
    function shuffle(arr) {
      return arr.sort(() => Math.random() - 0.5);
    }
    function stringFix(string) {
      return decodeURIComponent(string)
    }
    function arrayFix(array) {
      return array.map(row => stringFix(row))
    }
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}