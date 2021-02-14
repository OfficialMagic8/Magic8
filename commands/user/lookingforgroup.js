const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["lfg"],
  category: "USER",
  description: "Magic8's unique and efficient Looking For Group system",
  emoji: "🎮",
  name: "lookingforgroup",
  toggleable: true,
  // premium: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    // if ([1, 2].includes(bot.premium.get(message.guild.id))) {
    if (bot.lfgroles.has(message.guild.id)) {
      let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id))
      if (role) {
        let member = message.guild.members.cache.get(message.author.id) || await message.guild.members.fetch(message.author.id);
        let users = bot.lfgusers.get(message.guild.id);
        if (!users) {
          let a = [];
          a.push(message.author.id)
          bot.lfgusers.set(message.guild.id, a);
          users = bot.lfgusers.get(message.guild.id);
        }
        if (!member.roles.cache.has(bot.lfgroles.get(message.guild.id)) && !args[0]) {
          try {
            let cooldown = guildData.lfgcooldown;
            member.roles.add(bot.lfgroles.get(message.guild.id)).catch(e => { return bot.error(bot, message, language, e); });
            users.push(message.author.id);
            bot.lfgusers.set(message.guild.id, users);
            setTimeout(async () => {
              let users = bot.lfgusers.get(message.guild.id);
              if (!users) return;
              let sort = users.find(userid => userid === message.author.id);
              let member1 = message.guild.members.cache.get(message.author.id) || await message.guild.members.fetch(message.author.id);
              if (!sort && !member1.roles.cache.has(bot.lfgroles.get(message.guild.id))) return;
              let removed = users.filter(user => user !== member1.id);
              bot.lfgusers.set(message.guild.id, removed);
              if (bot.lfgusers.get(message.guild.id).length <= 0) {
                bot.lfgusers.delete(message.guild.id);
              }
              if (message.guild.roles.cache.has(bot.lfgroles.get(message.guild.id)) && message.guild.channels.cache.has(guildData.lfgnotifychannel) && guildData.lfgnotifymessage) {
                let log = message.guild.channels.cache.get(guildData.lfgnotifychannel)
                log.send(guildData.lfgnotifymessage.replace(/{USER}/g, message.author).replace(/{LFG}/, role)).catch(e => { });
              }
              if (member1.roles.cache.has(message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)).id)) {
                member1.roles.remove(role.id).catch(e => { });
              }
            }, (cooldown * 3600000));
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription(bot.translate(bot, language, "lookingforgroup.roleadded")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{USER}/g, message.author)
                .replace(/{ROLE}/g, role)
                .replace(/{COOLDOWN}/g, cooldown));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          } catch (e) { return bot.error(bot, message, language, e); }
        } else if (member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
          if (args[0] && args[0].toLowerCase() === "list") {
            let users = bot.lfgusers.get(message.guild.id);
            let sort = users.find(userid => userid === message.author.id);
            if (sort) {
              let memberarray = [];
              let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)) || await message.guild.roles.fetch(bot.lfgroles.get(message.guild.id))
              role.members.forEach(member => {
                memberarray.push(`${member} (${member.id})`)
              })
              if (memberarray.length === 0) {
                memberarray = [`*${bot.translate(bot, language, "none")}*`];
              }
              let embed = new MessageEmbed()
                .setColor(bot.colors.main)
                .setDescription(bot.translate(bot, language, "lookingforgroup.memberlist").join("\n")
                  .replace(/{LIST}/g, memberarray.map(m => `**•** ${m}`).join("\n")));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
          }
        }
        if (message.member.hasPermission("MANAGE_GUILD") && args[0]) {
          if (args[0].toLowerCase() === "list") {
            let memberarray = [];
            let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)) || await message.guild.roles.fetch(bot.lfgroles.get(message.guild.id))
            role.members.forEach(member => {
              memberarray.push(`${member} (${member.id})`)
            })
            if (memberarray.length === 0) {
              memberarray = [`*${bot.translate(bot, language, "none")}*`]
            }
            let embed = new MessageEmbed()
              .setColor(bot.colors.main)
              .setDescription(bot.translate(bot, language, "lookingforgroup.memberlist").join("\n")
                .replace(/{LIST}/g, memberarray.map(m => `**•** ${m}`).join("\n")));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
          if (args[0].toLowerCase() === "removeall") {
            let getrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id));
            if (getrole.members.size <= 0) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "lookingforgroup.nouserswithrole")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{USER}/g, message.author)
                  .replace(/{ROLE}/g, getrole));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "lookingforgroup.confirmremoveall").join("\n")
                .replace(/{WARNING}/g, bot.emoji.warning)
                .replace(/{USER}/g, message.author)
                .replace(/{ROLE}/g, getrole)
                .replace(/{INFO}/g, bot.emoji.info));
            return message.channel.send(embed).then(m => {
              const filter = m => m.author.id === message.author.id && message.content;
              message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] }).then(async collected => {
                let confirm = collected.first().content.toLowerCase() === "confirm";
                if (confirm) {
                  try {
                    m.delete({ timeout: 500 }).catch(e => { });
                    let oldrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id));
                    let newrole = await message.guild.roles.create({ data: oldrole });
                    oldrole.delete('Magic8 - LFG Remove All Users').then(deleted => {
                      bot.lfgroles.set(message.guild.id, newrole.id)
                      bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run(newrole.id, message.guild.id)
                    }).catch(e => { return bot.error(bot, message, language, e); });
                    let embed = new MessageEmbed()
                      .setColor(bot.colors.green)
                      .setDescription(bot.translate(bot, language, "lookingforgroup.removedall")
                        .replace(/{CHECK}/g, bot.emoji.check)
                        .replace(/{NEWROLE}/g, newrole))
                    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
                  } catch (e) { return bot.error(bot, message, language, e); }
                }
              }).catch(collected => {
                let oldrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id));
                m.delete({ timeout: 500 }).catch(e => { });
                let embed = new MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "lookingforgroup.didnotconfirm")
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{USER}/g, message.author)
                    .replace(/{ROLE}/g, oldrole))
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
              });
            }).catch(e => { return bot.error(bot, message, language, e); });
          } else if (message.mentions.users) {
            let target;
            try {
              let id = args[0].replace(/[^0-9]/g, "");
              target = bot.users.cache.get(id) || await bot.users.fetch(id);
            } catch (e) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "it")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{USER}/g, message.author));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            if (!target) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "it")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{USER}/g, message.author));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            let member = message.guild.members.cache.get(target.id) || await message.guild.members.fetch(target.id);
            if (member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
              member.roles.remove(bot.lfgroles.get(message.guild.id)).catch(e => { });
              let users = bot.lfgusers.get(message.guild.id);
              let sort = users.find(userid => userid === target.id);
              if (sort) {
                let removed = users.filter(user => user !== target.id);
                bot.lfgusers.set(message.guild.id, removed);
                if (bot.lfgusers.get(message.guild.id).length <= 0) {
                  bot.lfgusers.delete(message.guild.id);
                }
              }
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription(bot.translate(bot, language, "lookingforgroup.roleremoved")
                  .replace(/{CHECK}/g, bot.emoji.check)
                  .replace(/{TARGET}/g, target));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            } else if (!member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "lookingforgroup.alreadynorole")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{TARGET}/g, target));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
          }
        }
      } else if (!message.guild.roles.cache.has(role.id)) {
        bot.lfgroles.delete(message.guild.id);
        return bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run("none", message.guild.id);
      }
    } else {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "lookingforgroup.norole").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{BOT}/g, bot.user)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    // } else if (bot.premium.get(message.guild.id) === 0) {
    //   let embed = new MessageEmbed()
    //     .setColor(bot.colors.red)
    //     .setDescription(bot.translate(bot, language, "lookingforgroup.premium").join("\n")
    //       .replace(/{BOT}/g, bot.user)
    //       .replace(/{PACKAGES}/g, bot.config.donatelink));
    //   return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    // }
  }
}