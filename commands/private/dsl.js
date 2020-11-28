const Discord = require("discord.js");
module.exports = {
  aliases: [],
  name: "dsl",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    message.delete({timeout:500}).catch(e=>{})
    let dsl = []
    let disboard = []
    let discordme = []
    let discordservers = []
    let guilds = bot.guilds.cache.keyArray()
    for (let guild of guilds) {
      let users = bot.guilds.cache.get(guild).members.cache.filter(m=>!m.user.bot).size;
      let channels = bot.guilds.cache.get(guild).channels.cache.filter(c=>c.type!=="category").size
      let bots = bot.guilds.cache.get(guild).members.cache.filter(m=>m.user.bot).size
      if (bot.guilds.cache.get(guild).members.cache.has("422087909634736160")){
        dsl.push(`${bot.guilds.cache.get(guild).name} - ${guild} - ${users}/${bots}/${channels}`)
      }
    }
    for (let guild of guilds) {
      let users = bot.guilds.cache.get(guild).members.cache.filter(m=>!m.user.bot).size;
      let channels = bot.guilds.cache.get(guild).channels.cache.filter(c=>c.type!=="category").size
      let bots = bot.guilds.cache.get(guild).members.cache.filter(m=>m.user.bot).size
      if (bot.guilds.cache.get(guild).members.cache.has("302050872383242240")){
        disboard.push(`${bot.guilds.cache.get(guild).name} - ${guild} - ${users}/${bots}/${channels}`)
      }
    }
    for (let guild of guilds) {
      let users = bot.guilds.cache.get(guild).members.cache.filter(m=>!m.user.bot).size;
      let channels = bot.guilds.cache.get(guild).channels.cache.filter(c=>c.type!=="category").size
      let bots = bot.guilds.cache.get(guild).members.cache.filter(m=>m.user.bot).size
      if (bot.guilds.cache.get(guild).members.cache.has("476259371912003597")){
        discordme.push(`${bot.guilds.cache.get(guild).name} - ${guild} - ${users}/${bots}/${channels}`)
      }
    }
    for (let guild of guilds) {
      let users = bot.guilds.cache.get(guild).members.cache.filter(m=>!m.user.bot).size;
      let channels = bot.guilds.cache.get(guild).channels.cache.filter(c=>c.type!=="category").size
      let bots = bot.guilds.cache.get(guild).members.cache.filter(m=>m.user.bot).size
      if (bot.guilds.cache.get(guild).members.cache.has("115385224119975941")){
        discordservers.push(`${bot.guilds.cache.get(guild).name} - ${guild} - ${users}/${bots}/${channels}`)
      }
    }
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.main)
      .setAuthor(`Guilds with DSL then Disboard`)
      .setDescription("**DSL**\n" + dsl.join("\n") + "\n\n**Disboard**\n" + disboard.join("\n") + "\n\n**Discord.Me**\n" + discordme.join("\n") + "\n\n**DiscordServers**\n" + discordservers.join("\n"))
    message.channel.send(embed)
  }
}