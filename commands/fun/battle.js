const Discord = require("discord.js");
const battleImages = [
  "https://i.imgur.com/twa7UYI.gif",
  "https://i.pinimg.com/originals/49/1f/8c/491f8c735cfe482b5ce2552380990eea.gif",
  "https://media.giphy.com/media/110PaHIohJywso/giphy.gif",
  "https://media.giphy.com/media/BfcvOCQQ1c1UY/giphy-downsized-large.gif",
  "https://thumbs.gfycat.com/CapitalEvergreenIndiancow-small.gif",
  "https://media.giphy.com/media/HgOOcZTObRPd6/giphy.gif"
]
module.exports = {
  aliases: ["batalla", "duel", "fight", "battles"],
  category: "FUN",
  description: "Have an intense fight with others or Magic8.",
  emoji: "⚔️",
  name: "battle",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.battling.has(message.author.id)) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "battle.error.alreadybattling")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (!args[0]) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let target;
    try {
      let id = args[0].replace(/[^0-9]/g, "")
      target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
    } catch (e) {
      let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.red)
      .setDescription(bot.translate(bot, language, "it")
        .replace(/{CROSS}/g, bot.emoji.cross)
        .replace(/{USER}/g, message.author));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (!target) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (target.id === message.author.id) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "battle.error.cannotbeauthor")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (bot.battling.has(target.id)) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "battle.error.targetbattling")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let firstobject = {
      userid: message.author.id,
      user: message.author,
      guildid: message.guild.id,
      otherid: target.id,
      turn: 1,
      hp: 100,
      moves: 0,
      attacks: []
    }
    let secondobject = {
      userid: target.id,
      user: target.user,
      guildid: message.guild.id,
      otherid: message.author.id,
      turn: 1,
      hp: 100,
      moves: 0
    }
    bot.battling.set(message.author.id, firstobject)
    bot.battling.set(target.id, secondobject)
    startBattle(bot, message.channel, language, message.author, target.user, firstobject, secondobject);
    function startBattle(bot, channel, language, first, second, firstobject, secondobject) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(bot.translate(bot, language, "battle.title")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setImage("https://thumbs.gfycat.com/DirtyMeagerAss-small.gif")
        .setColor(bot.colors.yellow)
      channel.send(embed).then(duelMessage => {
        let battleEmbed = new Discord.MessageEmbed()
          .setImage(battleImages[Math.floor(Math.random() * battleImages.length)])
          .setAuthor(bot.translate(bot, language, "battle.title")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setColor(bot.colors.yellow)
        setTimeout(() => {
          let attacks = bot.translate(bot, language, "battle.battling.attacks");
          let interval = setInterval(() => {
            if (firstobject.hp <= 0) {
              let winsArray = bot.translate(bot, language, "battle.battling.wins");
              firstobject.attacks.push(winsArray[Math.floor(Math.random() * winsArray.length)]
                .replace(/{WINNERMEMBER}/g, second.username)
                .replace(/{WINNERMOVES}/g, secondobject.moves)
                .replace(/{LOSERMEMBER}/g, first.username)
                .replace(/{LOSERMOVES}/g, firstobject.moves));
              battleEmbed.setColor(bot.colors.red)
              battleEmbed.setImage("https://i.imgur.com/V2eOyD0.png")
              battleEmbed.setDescription(firstobject.attacks.slice(-3).join("\n"));
              bot.battling.delete(first.id)
              bot.battling.delete(second.id)
              duelMessage.edit(battleEmbed).catch(e => { return bot.error(bot, message, language, e); });
              clearInterval(interval)
            } else if (secondobject.hp <= 0) {
              let winsArray = bot.translate(bot, language, "battle.battling.wins");
              firstobject.attacks.push(winsArray[Math.floor(Math.random() * winsArray.length)]
                .replace(/{WINNERMEMBER}/g, first.username)
                .replace(/{WINNERMOVES}/g, firstobject.moves)
                .replace(/{LOSERMEMBER}/g, second.username)
                .replace(/{LOSERMOVES}/g, secondobject.moves));
              battleEmbed.setColor(bot.colors.green)
              battleEmbed.setImage("https://i.imgur.com/V2eOyD0.png")
              battleEmbed.setDescription(firstobject.attacks.slice(-3).join("\n"));
              bot.battling.delete(first.id)
              bot.battling.delete(second.id)
              duelMessage.edit(battleEmbed).catch(e => { return bot.error(bot, message, language, e); });
              clearInterval(interval)
            } else {
              let damage = Math.floor(Math.random() * 15) + 7
              let attack = attacks[Math.floor(Math.random() * attacks.length)]
              if (firstobject.turn === 0) {
                firstobject.turn = 1;
                attack = attack.replace(/{TEAM}/g, "\\🟢")
                  .replace(/{ATTACKER}/g, first.username)
                  .replace(/{TARGET}/g, second.username)
                  .replace(/{DAMAGE}/g, damage)
                secondobject.hp = secondobject.hp - damage <= 0 ? 0 : secondobject.hp - damage
                battleEmbed.setColor(bot.colors.green)
                firstobject.moves = firstobject.moves + 1
              } else {
                firstobject.turn = 0;
                attack = attack.replace(/{TEAM}/g, "\\🔴")
                  .replace(/{ATTACKER}/g, second.username)
                  .replace(/{TARGET}/g, first.username)
                  .replace(/{DAMAGE}/g, damage)
                firstobject.hp = firstobject.hp - damage <= 0 ? 0 : firstobject.hp - damage
                battleEmbed.setColor(bot.colors.red)
                secondobject.moves = secondobject.moves + 1
              }
              firstobject.attacks.push(attack);
              battleEmbed.setDescription(firstobject.attacks.slice(-3).join("\n"));
              battleEmbed.fields = [];
              battleEmbed.addField(`\\🟢 ${first.username} HP`, `❤️ ${firstobject.hp}/100`, true)
              battleEmbed.addField(`\\🔴 ${second.username} HP`, `❤️ ${secondobject.hp}/100`, true)
              duelMessage.edit(battleEmbed).catch(e => { return bot.error(bot, message, language, e); });
            }
          }, 5000);
        }, 1500)
      }).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}