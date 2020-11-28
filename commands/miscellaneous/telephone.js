const Discord = require("discord.js");
const minRingTime = 10000;
const maxRingTime = 60000;
module.exports = {
  aliases: ["call"],
  category: "MISCELLANEOUS",
  description: "Make a random call to someone in another guild!",
  emoji: "☎️",
  name: "telephone",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (bot.onthephone.has(message.guild.id)) {
      let object = bot.onthephone.get(message.guild.id);
      if (object.talking) {
        let incall = new Discord.MessageEmbed()
          .setColor(bot.colors.lightred)
          .setDescription(bot.translate(bot, language, "telephone.someoneinacall").replace(/{CROSS}/g, bot.emoji.cross))
        return message.channel.send(incall).catch(e => { });
      }
      let someoneusing = new Discord.MessageEmbed()
        .setColor(bot.colors.lightred)
        .setDescription(bot.translate(bot, language, "telephone.someoneusingtelephone").replace(/{CROSS}/g, bot.emoji.cross))
      return message.channel.send(someoneusing).catch(e => { });
    }
    let ringing = new Discord.MessageEmbed()
      .setColor(bot.colors.lightgreen)
      .setDescription(bot.translate(bot, language, "telephone.ringing").replace(/{USER}/g, message.author))
    message.channel.send(ringing).catch(e => { });
    let callTimeout = setTimeout(() => {
      let caller = bot.calling.find(obj => obj.guildid === message.guild.id)
      // console.log("Caller")
      // console.log(caller)
      if (caller) {
        bot.calling = bot.calling.filter(obj => obj.guildid !== message.guild.id)
        // console.log(`Possible posibilities: ${bot.calling.length}`)
        // console.log(bot.calling)
        if (bot.calling.length >= 1) {
          let randomPhone = bot.calling.splice(Math.floor(Math.random() * bot.calling.length), 1);
          // console.log("Splicing")
          // console.log(randomPhone)
          if (randomPhone.length >= 1) {
            randomPhone = randomPhone[0];
            // console.log("Random phone")
            // console.log(randomPhone)
            bot.onthephone.get(randomPhone.guildid).talking = true;
            bot.onthephone.get(message.guild.id).talking = true;
            let secondGuildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(randomPhone.guildid)
            if (!secondGuildData) secondGuildData = { language: "en" }
            let secondlanguage = bot.utils.getLanguage(bot, secondGuildData.language);
            startCall(bot, caller, randomPhone, language, secondlanguage);
            try {
              clearTimeout(caller.timeout);
            } catch (e) { }
            try {
              clearTimeout(randomPhone.timeout);
            } catch (e) { }
          }
        } else {
          bot.onthephone.delete(message.guild.id)
          let nopickup = new Discord.MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription(bot.translate(bot, language, "telephone.nooneanswered").replace(/{USER}/g, message.author).replace(/{CROSS}/g, bot.emoji.cross))
          message.channel.send(nopickup).catch(e => { });
          try {
            clearTimeout(caller.timeout)
          } catch (e) { }
        }
      } else return;
    }, Math.random() * (maxRingTime - minRingTime) + minRingTime)
    let object = {
      caller: message.author.id,
      guildid: message.guild.id,
      channelid: message.channel.id,
      tag: message.author.tag,
      talking: false,
      collector: undefined,
      timeout: callTimeout,
      autoend: undefined
    }
    bot.calling.push(object);
    bot.onthephone.set(message.guild.id, object)
    function startCall(bot, first, second, firstlanguage, secondlanguage) {
      // console.log("Call started!")
      // console.log(first)
      // console.log(second)
      let firstChannel = bot.channels.cache.get(first.channelid);
      let secondChannel = bot.channels.cache.get(second.channelid);
      if (firstChannel && secondChannel) {
        let firstestablished = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setDescription(bot.translate(bot, firstlanguage, "telephone.establised").replace(/{CROSS}/g, bot.emoji.cross))
        let secondestablished = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setDescription(bot.translate(bot, secondlanguage, "telephone.establised").replace(/{CROSS}/g, bot.emoji.cross))
        firstChannel.send(firstestablished).catch(e => { });
        secondChannel.send(secondestablished).catch(e => { });
        let firstChannelCollector = firstChannel.createMessageCollector(m => m.author.id === first.caller)
        first.collector = firstChannelCollector;
        let secondChannelCollector = secondChannel.createMessageCollector(m => m.author.id === second.caller)
        second.collector = secondChannelCollector;
        firstChannelCollector.on("collect", m => {
          let content = m.content ? m.content.toLowerCase() : m.content
          if (content) {
            console.log(`[📞] ${m.author.tag} > ${second.tag}: ${m.content}`)
            if (["hang up", "hang", "colgar", "end call", "hangup", "byebye", "bye"].includes(content)) return stopCall(bot, first, true, second, false, firstlanguage, secondlanguage)
            let toChannel = bot.channels.cache.get(second.channelid);
            if (toChannel) {
              toChannel.send(`\\📞 \`${m.content.replace(/@everyone/gi, "<everyone>").replace(/@here/gi, "<here>")}\``).catch(e => { });
              clearTimeout(first.autoend);
              first.autoend = setTimeout(() => {
                console.log(`[⏰] Timeout for call between ${first.tag} & ${second.tag}. Ending call...`)
                endCall(bot, first, second, firstlanguage, secondlanguage);
              }, 60000);
            } else {
              return stopCall(bot, first, false, second, false, firstlanguage, secondlanguage)
            }
          }
        })
        secondChannelCollector.on("collect", m => {
          let content = m.content ? m.content.toLowerCase() : m.content
          if (content) {
            console.log(`[📞] ${m.author.tag} > ${first.tag}: ${m.content}`)
            if (["hang up", "hang", "colgar", "end call", "hangup", "byebye", "bye"].includes(content)) return stopCall(bot, first, false, second, true, firstlanguage, secondlanguage)
            let toChannel = bot.channels.cache.get(first.channelid);
            if (toChannel) {
              toChannel.send(`\\📞 \`${m.content.replace(/@everyone/gi, "<everyone>").replace(/@here/gi, "<here>")}\``).catch(e => { });
              clearTimeout(first.autoend);
              first.autoend = setTimeout(() => {
                console.log(`[⏰] Timeout for call between ${first.tag} & ${second.tag}. Ending call...`)
                endCall(bot, first, second, firstlanguage, secondlanguage);
              }, 60000);
            } else return stopCall(bot, first, false, second, false, firstlanguage, secondlanguage)
          }
        })
      } else {
        stopCall(bot, first, false, second, false, firstlanguage, secondlanguage)
      }
    }
    function stopCall(bot, first, firsthungup, second, secondhungup, firstlanguage, secondlanguage) {
      bot.onthephone.delete(first.guildid);
      bot.onthephone.delete(second.guildid);
      try {
        clearTimeout(first.autoend)
      } catch (e) { }
      if (bot.channels.cache.has(first.channelid)) {
        if (firsthungup) {
          console.log(`[🔴] ${first.tag} hung up!`)
          bot.channels.cache.get(first.channelid).send(bot.translate(bot, firstlanguage, "telephone.youhungup")).catch(e => { });
        } else {
          bot.channels.cache.get(first.channelid).send(bot.translate(bot, firstlanguage, "telephone.otherhungup")).catch(e => { });
        }
      }
      if (bot.channels.cache.has(second.channelid)) {
        if (secondhungup) {
          console.log(`[🔴] ${second.tag} hung up!`)
          bot.channels.cache.get(second.channelid).send(bot.translate(bot, secondlanguage, "telephone.youhungup")).catch(e => { });
        } else {
          bot.channels.cache.get(second.channelid).send(bot.translate(bot, secondlanguage, "telephone.otherhungup")).catch(e => { });
        }
      }
      try {
        first.collector.stop()
      } catch (e) { }
      try {
        second.collector.stop()
      } catch (e) { }
    }
    function endCall(bot, first, second, firstlanguage, secondlanguage) {
      bot.onthephone.delete(first.guildid);
      bot.onthephone.delete(second.guildid);
      if (bot.channels.cache.has(first.channelid)) {
        bot.channels.cache.get(first.channelid).send(bot.translate(bot, firstlanguage, "telephone.timeout")).catch(e => { });
      }
      if (bot.channels.cache.has(second.channelid)) {
        bot.channels.cache.get(second.channelid).send(bot.translate(bot, secondlanguage, "telephone.timeout")).catch(e => { });
      }
      try {
        first.collector.stop()
      } catch (e) { }
      try {
        second.collector.stop()
      } catch (e) { }
    }
  }
}