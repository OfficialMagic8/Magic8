const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildMemberUpdate",
  run: async (bot, oldMember, newMember) => {
    let guild = bot.guilds.cache.get((oldMember || newMember).guild.id);
    if (bot.lfgroles.has(guild.id) && guild.roles.cache.has(bot.lfgroles.get(guild.id)) && !newMember.roles.cache.has(bot.lfgroles.get(guild.id)) && oldMember.roles.cache.has(bot.lfgroles.get(guild.id))) {
      let users = bot.lfgusers.get(guild.id);
      if (users && users.includes(newMember.id)) {
        let removed = users.filter(user => user !== newMember.id);
        bot.lfgusers.set(guild.id, removed);
        if (bot.lfgusers.get(guild.id).length <= 0) {
          bot.lfgusers.delete(guild.id);
        }
      }
    }
  }
}