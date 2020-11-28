const Discord = require("discord.js");
module.exports = {
  name: "messageUpdate",
  run: async (bot, oldMessage, newMessage) => {
    if (bot.antiping.has((oldMessage || newMessage).guild.id) && newMessage.content) {
      if (newMessage.mentions.members.keyArray().length >= 1) {
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get((oldMessage || newMessage).guild.id);
        if (!guildData) {
          bot.db.prepare("INSERT INTO guilddata (guildid) VALUES (?)").run((oldMessage || newMessage).guild.id);
          guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get((oldMessage || newMessage).guild.id);
        }
        let tagged = JSON.parse(guildData.antipingusers).filter(e => newMessage.mentions.members.keyArray().includes(e));
        if (tagged.length >= 1) {
          let member = await (oldMessage || newMessage).guild.members.fetch(newMessage.author.id)
          let getbypassroles = JSON.parse(guildData.antipingbypassroles)
          let hasroles = false
          getbypassroles.forEach((item, index) => {
            if (newMessage.guild.roles.cache.has(item)) {
              if (member.roles.cache.has(item)) {
                hasroles = true
              }
            }
          })
          if (hasroles === false) {
            newMessage.delete({ timeout: 250 })
            if (guildData.antipingmessage.length >= 1) {
              newMessage.channel.send((guildData.antipingmessage).replace(/{USER}/g, newMessage.author)).catch(e => { });
            }
          }
        }
      }
    }
  }
}