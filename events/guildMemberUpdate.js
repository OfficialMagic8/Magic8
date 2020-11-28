const Discord = require("discord.js");
module.exports = {
  name: "guildMemberUpdate",
  run: async (bot, oldMember, newMember) => {
    let guild = bot.guilds.cache.get((oldMember || newMember).guild.id);
    if (newMember.roles.cache.size < oldMember.roles.cache.size && bot.lfgroles.has(guild.id)) {
      if (!newMember.roles.cache.has(bot.lfgroles.get(guild.id)) && oldMember.roles.cache.has(bot.lfgroles.get(guild.id))) {
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
        let current = JSON.parse(guildData.lfgusers)
        let sort = current.find(userid => userid === newMember.id)
        if (sort !== undefined) {
          current.splice(current.indexOf(sort), 1)
          bot.db.prepare("UPDATE guilddata SET lfgusers=? WHERE guildid=?").run(JSON.stringify(current), guild.id)
        }
      }
    }
  }
}