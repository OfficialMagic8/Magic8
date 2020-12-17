const { MessageEmbed } = require("discord.js");
const botStats = {
  totalGuildsID: '652539034404519936',
  totalUsersID: '652538780376367104',
};
module.exports = {
  name: "guildDelete",
  run: async (bot, guild) => {
    if (!guild.available) return;
    let text = `📚 Guilds : ${bot.guilds.cache.size}`;
    let channel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(botStats.totalGuildsID);
    if (channel) {
      if (channel.name !== text) {
        channel.setName(text);
      }
    }
    bot.premium.delete(guild.id);
    if (bot.helpmenus.has(guild.id)) bot.helpmenus.delete(guild.id);
    if (bot.adminmenus.has(guild.id)) bot.adminmenus.delete(guild.id);
    bot.db.prepare("UPDATE guilddata SET inguild=? WHERE guildid=?").run("false", guild.id);
    bot.udb.prepare("UPDATE usagedata SET inguild=? WHERE guildid=?").run("false", guild.id);
    let outage = false;
    let users = guild.members.cache.filter(m => !m.user.bot).size;
    let channels = guild.channels.cache.filter(c => c.type !== "category").size;
    let bots = guild.members.cache.filter(m => m.user.bot).size;
    let created = guild.createdAt.toLocaleString().split("GMT")[0].trim();
    let embed = new MessageEmbed()
    if (users <= 0 && channels <= 0 && bots <= 0) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      outage = true;
      embed.setTitle(`${bot.emoji.outage} - Guild Outage`)
        .setThumbnail("https://discordemoji.com/assets/emoji/6460_outage.png")
        .setColor("#9c5446")
        .setDescription([
          `**Name:** ${guildData.guildname} (**${guild.id}**)`, ``,
          `**Users/Bots/Channels:** (${users}/${bots}/${channels})`, ``,
          ``,
          `**Date Created:** ${created} GMT`])
    } else {
      embed.setTitle(`${bot.emoji.minus} - Guild Leave`)
        .setThumbnail(guild.iconURL({ format: "png" }))
        .setColor(bot.colors.red)
        .setDescription([
          `**Name:** ${guild.name} (**${guild.id}**)`,
          ``,
          `**Users/Bots/Channels:** (${users}/${bots}/${channels})`,
          ``,
          `**Date Created:** ${created} GMT`])
    }
    let logsChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.guildlogs);                                                                                                                                                                                                                                         // wait can there be emojis in title i forgot
    if (logsChannel) {
      logsChannel.send(embed).catch(e => { });
    }
    let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
    let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(guild.id);
    bot.hastebin(JSON.stringify(JSON.parse(usageData.usage), null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
      logsChannel.send(`Usage Data: ${haste}`).catch(e => { });
    }).catch(e => {
      console.error(e);
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **There was an error fetching the Guild Data!**`)
      return message.channel.send(error).catch(e => { });
    });
    bot.hastebin(JSON.stringify(guildData, null, 2), { url: "https://paste.mod.gg", extension: "json" }).then(haste => {
      logsChannel.send(`Guild Data: ${haste}`).catch(e => { });
    }).catch(e => {
      console.error(e);
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **There was an error fetching the Guild Data!**`)
      return message.channel.send(error).catch(e => { });
    });
  }
}