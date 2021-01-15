const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  name: "addcommand",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    let guildsids = bot.guilds.cache.keyArray();
    let loaded = bot.udb.prepare("SELECT * FROM usagedata").all().filter(row => guildsids.includes(row.guildid));
    loaded.forEach(row => {
      let usage = JSON.parse(row.usage);
      let o = {
        command: "toggle",
        category: "ADMINISTRATOR",
        usage: 0
      }
      usage.push(o);
      let b = {
        command: "summary",
        category: "INFORMATION",
        usage: 0
      }
      usage.push(b);
      bot.udb.prepare("UPDATE usagedata SET usage=? WHERE guildid=?").run(JSON.stringify(usage), row.guildid);
    });
  }
}