const Discord = require("discord.js");
module.exports = {
  name: "guildUpdate",
  run: async (bot, newGuild, oldGuild) => {
    if (newGuild.name !== oldGuild.name) {
      bot.db.prepare("UPDATE guilddata SET guildname=? WHERE guildid=?").run(newGuild.name, newGuild.id);
    }
  }
}