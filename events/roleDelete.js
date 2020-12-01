const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "roleDelete",
  run: async (bot, role) => {
    let guild = bot.guilds.cache.get(role.guild.id);
    if (bot.lfgroles.has(guild.id)) {
      if (role.id === bot.lfgroles.get(guild.id)) {
        bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run("none", guild.id)
        bot.lfgroles.delete(guild.id)
      }
    }
    if (bot.antipingbypassroles.has(guild.id)) {
      if (bot.antipingbypassroles.get(guild.id).includes(role.id)) {
        let removed = bot.antipingbypassroles.get(guild.id).filter(r => r !== role.id)
        bot.db.prepare("UPDATE guilddata SET antipingbypassroles=? WHERE guildid=?").run(JSON.stringify(removed), guild.id)
        bot.antipingbypassroles.set(guild.id, removed)
        if (bot.antipingbypassroles.get(guild.id).length === 0) {
          bot.antipingbypassroles.delete(guild.id)
        }
      }
    }
  }
}