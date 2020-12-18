const { MessageEmbed } = require("discord.js");
const faker = require('faker');
module.exports = {
  aliases: [],
  category: "ENTERTAINMENT",
  description: "Pretend to hack a friend.",
  emoji: "💻",
  name: "hack",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let target;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g, "");
      try {
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setDescription(bot.translate(bot, language, "it")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
          .setColor(bot.colors.red)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    if (!target) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "it")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (bot.playerhacked.has(target.id)) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "hack.alreadyhacking")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{TARGET}/g, target))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let targetName = bot.cleanTags(target.username)
    return message.channel.send(bot.translate(bot, language, "hack.starting")
      .replace(/{TARGET}/g, targetName)
      .replace(/{HACK}/g, bot.emoji.hack)).then(hackMessage => {
        bot.playerhacked.set(target.id)
        let index = 0;
        let processes = bot.translate(bot, language, "hack.process");
        let processList = Object.keys(processes);
        setTimeout(() => {
          executeProcess(bot, language, target, processList, processes, hackMessage, index, targetName, "");
        }, Math.floor(Math.random() * 3000) + 5000)
      }).catch(e => {
        bot.error(bot, message, language, e);
      });
    function executeProcess(bot, language, target, processList, processes, hackMessage, index, targetName, old) {
      if (hackMessage.deleted) {
        bot.playerhacked.delete(target.id)
        let toAdd = bot.translate(bot, language, "hack.interrupted")
          .replace(/{TARGET}/g, targetName)
          .replace(/{LOADING}/g, bot.emoji.loading)
          .replace(/{CROSS}/g, bot.emoji.cross);
        return hackMessage.channel.send(old + "\n" + toAdd).catch(e => { });
      }
      if (index >= processList.length) {
        let toAdd = bot.translate(bot, language, "hack.finishing")
          .replace(/{TARGET}/g, targetName)
          .replace(/{HACK}/g, bot.emoji.hack)
        hackMessage.edit(old + "\n" + toAdd).catch(e => { });
        setTimeout(() => {
          hackMessage.edit(bot.translate(bot, language, "hack.finished")
            .replace(/{TARGET}/g, targetName)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{CHECK}/g, bot.emoji.check)).catch(e => { });
          bot.playerhacked.delete(target.id)
        }, 3000)
        return;
      }
      let randomregister = ["Crunchydoll", "Netflix", "Minecraft", "Spotify", "Trivago"]
      let processObject = processes[processList[index]];
      let time = Math.floor(Math.random() * ((processObject.time + 2000) - processObject.time) + processObject.time);
      let toAdd = processObject.message.replace(/{TARGET}/g, targetName).replace(/{LOADING}/g, bot.emoji.loading).replace(/{RANDOMIP}/g, randomIP()).replace(/{RANDOMCREDITCARD}/g, bot.utils.randomCreditCard("VISA"))
        .replace(/{RANDOMIPV6}/g, faker.internet.ipv6()).replace(/{RANDOMMAC}/g, faker.internet.mac()).replace(/{IPONFIREWALL}/g, faker.internet.mac().replace(/:/g, "-"))
        .replace(/{RANDOMEMAIL}/g, randomEmail(targetName)).replace(/{RANDOMPASSWORD}/g, faker.internet.password())
        .replace(/{RANDOMREGISTER}/g, randomregister[Math.floor(Math.random() * randomregister.length)])
      hackMessage.edit(old + "\n" + toAdd).catch(e => {
        bot.error(bot, message, language, e);
      });
      index++;
      setTimeout(() => {
        executeProcess(bot, language, target, processList, processes, hackMessage, index, targetName, old + "\n" + toAdd);
      }, time);
    }
    function randomIP() {
      return (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255));
    }
    function randomEmail(targetName) {
      let parts = targetName.split(" ").map(p => p.replace(/[^a-zA-Z0-9]/g, "")).filter(p => p.length >= 1)
      if (parts.length <= 0) {
        return faker.internet.email().replace(/\,/g, ".");
      }
      if (parts.length <= 1) {
        return faker.internet.email([parts[0], faker.name.lastName()]).replace(/\,/g, ".");
      }
      let firstName = parts.shift();
      return faker.internet.userName([firstName, parts.join("")]).replace(/\,/g, ".")
    }
  }
}