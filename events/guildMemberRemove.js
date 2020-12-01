const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildMemberRemove",
  run: async (bot, member) => {
    if (bot.antipingusers.has(member.guild.id)) {
      if (bot.antipingusers.get(member.guild.id).includes(member.id)) {
        let removed = bot.antipingusers.get(member.guild.id).filter(u => u !== member.id)
        bot.antipingusers.set(member.guild.id, removed)
        bot.db.prepare("UPDATE guilddata SET antipingusers=? WHERE guildid=?").run(JSON.stringify(removed), member.guild.id);
        if (bot.antipingusers.get(member.guild.id).length === 0) {
          bot.antipingusers.delete(member.guild.id)
        }
      }
    }
  }
}