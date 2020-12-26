const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  name: "sortcommands",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let guildsids = bot.guilds.cache.keyArray();
    let loaded = bot.udb.prepare("SELECT * FROM usagedata").all().filter(row => guildsids.includes(row.guildid));
    loaded.forEach(row => {
      let usage = JSON.parse(row.usage);
      usage.sort(function (a, b) {
        let nameA = a.command.toUpperCase();
        let nameB = b.command.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      usage.sort(function (a, b) {
        let nameA = a.category.toUpperCase();
        let nameB = b.category.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      bot.udb.prepare("UPDATE usagedata SET usage=? WHERE guildid=?").run(JSON.stringify(usage), row.guildid);
    });
  }
}