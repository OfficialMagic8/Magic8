const Discord = require("discord.js");
module.exports = {
  name: "channelDelete",
  run: async (bot, channel) => {
    let guild = channel.guild
    if (bot.funchannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      let func = JSON.parse(guildData.funchannel)
      if (func.includes(channel.id)) {
        func.splice(func.indexOf(channel.id), 1)
        bot.db.prepare("UPDATE guilddata SET funchannel=? WHERE guildid=?").run(JSON.stringify(func), guild.id);
        let channels = bot.funchannels.get(guild.id)
        channels.splice(channels.indexOf(channel.id), 1)
        if (channels.length <= 0) {
          bot.funchannels.delete(guild.id)
        } else {
          bot.funchannels.set(guild.id, channels)
        }
      }
    }
    if (bot.minigamechannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      let minic = JSON.parse(guildData.minigamechannel)
      if (minic.includes(channel.id)) {
        minic.splice(minic.indexOf(channel.id), 1)
        bot.db.prepare("UPDATE guilddata SET minigamechannel=? WHERE guildid=?").run(JSON.stringify(minic), guild.id);
        let channels = bot.minigamechannels.get(guild.id)
        channels.splice(channels.indexOf(channel.id), 1)
        if (channels.length <= 0) {
          bot.minigamechannels.delete(guild.id)
        } else {
          bot.minigamechannels.set(guild.id, channels)
        }
      }
    }
    if (bot.miscellaneouschannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      let miscc = JSON.parse(guildData.miscellaneouschannel)
      if (miscc.includes(channel.id)) {
        miscc.splice(miscc.indexOf(channel.id), 1)
        bot.db.prepare("UPDATE guilddata SET miscellaneouschannel=? WHERE guildid=?").run(JSON.stringify(miscc), guild.id);
        let channels = bot.miscellaneouschannels.get(guild.id)
        channels.splice(channels.indexOf(channel.id), 1)
        if (channels.length <= 0) {
          bot.miscellaneouschannels.delete(guild.id)
        } else {
          bot.miscellaneouschannels.set(guild.id, channels)
        }
      }
    }
    if (bot.reactionchannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      let reacc = JSON.parse(guildData.reactionchannel)
      if (reacc.includes(channel.id)) {
        reacc.splice(reacc.indexOf(channel.id), 1)
        bot.db.prepare("UPDATE guilddata SET reactionchannel=? WHERE guildid=?").run(JSON.stringify(reacc), guild.id);
        let channels = bot.reactionchannels.get(guild.id)
        channels.splice(channels.indexOf(channel.id), 1)
        if (channels.length <= 0) {
          bot.reactionchannels.delete(guild.id)
        } else {
          bot.reactionchannels.set(guild.id, channels)
        }
      }
    }
    if (bot.voicechannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      if (channel.parentID === guildData.autovoicecategory) {
        let createchannels = JSON.parse(guildData.autovoicechannels)
        let possiblecreatechannels = []
        createchannels.forEach(c => {
          possiblecreatechannels.push(c.id)
        })
        if (possiblecreatechannels.includes(channel.id)) {
          let vc = createchannels.find(i => i.id === channel.id)
          createchannels.splice(createchannels.indexOf(vc), 1)
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(createchannels), guild.id);
          if (createchannels.length <= 0) {
            bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(0, guild.id)
          }
        }
      }
      if (guildData.autovoicecategory === channel.id) {
        bot.db.prepare("UPDATE guilddata SET autovoicecategory=? WHERE guildid=?").run("none", guild.id);
        bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(0, guild.id)
        bot.voicechannels.delete(guild.id)
      }
    }
    if (bot.lfgnotifychannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      if (channel.id === guild.channels.cache.get(guildData.lfgnotifychannel)) {
        bot.db.prepare("UPDATE guilddata SET lfgnotifychannel=? WHERE guildid=?").run("none", guild.id);
        bot.lfgnotifychannels.delete(guild.id)
      }
    }
    if (bot.antipinglogchannels.has(guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      if (channel.id === guild.channels.cache.get(guildData.antipinglogchannel)) {
        bot.db.prepare("UPDATE guilddata SET antipinglogchannel=? WHERE guildid=?").run("none", guild.id);
        bot.antipinglogchannels.delete(guild.id)
      }
    }
  }
}