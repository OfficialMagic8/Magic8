const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildUpdate",
  run: async (bot, oldGuild, newGuild) => {
    if (newGuild.name !== oldGuild.name) {
      bot.db.prepare("UPDATE guilddata SET guildname=? WHERE guildid=?").run(newGuild.name, newGuild.id);
      bot.udb.prepare("UPDATE usagedata SET guildname=? WHERE guildid=?").run(newGuild.name, newGuild.id);
      bot.vdb.prepare("UPDATE votedata SET guildname=? WHERE guildid=?").run(newGuild.name, newGuild.id);
    }
  }
}