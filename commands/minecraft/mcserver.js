const Discord = require("discord.js");
const mc = require('minecraft-server-util');
module.exports = {
  aliases: ["mcstatus", "status"],
  category: "MINECRAFT",
  description: "Check your own server status",
  emoji: "🎮",
  name: "mcserver",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    if (message.member.hasPermission("MANAGE_GUILD") && args[0]) {
      if (args[0] === "remove") {
        bot.db.prepare("UPDATE guilddata SET mcserverip=? WHERE guildid=?").run("none", message.guild.id)
        bot.mcservers.delete(message.guild.id)
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "mcserver.removed")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let updating = new Discord.MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "mcserver.checking")
          .replace(/{LOADING}/g, bot.emoji.loading))
      let updatingMessage
      try {
        updatingMessage = await message.channel.send(updating);
      } catch (e) {
        bot.error(bot, message, language, e);
      }
      mc.queryFull(args[0]).then(server => {
        bot.db.prepare("UPDATE guilddata SET mcserverip=? WHERE guildid=?").run(args[0], message.guild.id)
        bot.mcservers.set(message.guild.id, args[0])
        updating.setColor(bot.colors.green)
        updating.setDescription(bot.translate(bot, language, "mcserver.updated").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{SERVER}/g, args[0])
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix))
        updatingMessage.edit(updating).catch(e => bot.error(bot, message, language, e));
      }).catch(e => {
        mc.status(args[0]).then(server => {
            bot.db.prepare("UPDATE guilddata SET mcserverip=? WHERE guildid=?").run(args[0], message.guild.id)
            bot.mcservers.set(message.guild.id, args[0])
            updating.setColor(bot.colors.green)
            updating.setDescription(bot.translate(bot, language, "mcserver.updated").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{SERVER}/g, args[0])
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix))
            updatingMessage.edit(updating).catch(e => bot.error(bot, message, language, e));
          })
          .catch(e => {
            updating.setColor(bot.colors.red);
            updating.setFooter(bot.translate(bot, language, "mcserver.errorfooter"));
            updating.setDescription(bot.translate(bot, language, "mcserver.error").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{SERVER}/g, args[0]));
            updatingMessage.edit(updating).catch(e => {
              bot.error(bot, message, language, e);
            })
          });
      })
    } else {
      if (bot.mcservers.has(message.guild.id)) {
        let server = bot.mcservers.get(message.guild.id)
        mc.queryFull(server).then(data => {
          let embed = new Discord.MessageEmbed()
            .setColor(bot.colors.main)
            .setDescription([
              `${bot.emoji.check} **Status:** \`online\``,
              `📡 **IP:** \`${server}\``,
              ``,
              `👥 **Players:** ${data.onlinePlayers}/${data.maxPlayers}`,
              `${data.players ? data.players.map(p => `**-** ${p.replace(/_/g, "\_")}`).join("\n") : `**-** *${bot.translate(bot, language, "none")}*`}`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }).catch(e => {
          let embed = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setFooter(bot.translate(bot, language, "mcserver.errorfooter"))
            .setDescription(bot.translate(bot, language, "mcserver.error").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{SERVER}/g, server));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        });
      } else {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "mcserver.noip").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    }
  }
}