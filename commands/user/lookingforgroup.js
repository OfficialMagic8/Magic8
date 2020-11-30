const Discord = require("discord.js");
module.exports = {
  aliases: ["lfg"],
  category: "USER",
  description: "Send yourself to the (if set) server's Looking For Group channel!",
  emoji: "🎮",
  name: "lookingforgroup",
  toggleable: true,
  premium: true,
  run: async (bot, message, args, prefix, guildData) => {
    // console.log("command run")
    let language = bot.utils.getLanguage(bot, guildData.language)
    if ([1, 2].includes(bot.premium.get(message.guild.id))) {
      // console.log("has premium")
      if (bot.lfgroles.has(message.guild.id)) {
        // console.log("not none")
        let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id))
        if (message.guild.roles.cache.has(role.id)) {
          let member = await message.guild.members.fetch(message.author.id)
          let data = JSON.parse(guildData.lfgusers)
          // bot.lfgusers.set(message.guild.id, bot.lfgusers.has(message.guild.id) ? bot.lfgusers.get(message.guild.id) : new Array())
          // let data = bot.lfgusers.get(message.guild.id)
          let sort = data.find(userid => userid === message.author.id)
          if (!member.roles.cache.has(bot.lfgroles.get(message.guild.id)) && sort === undefined && !args[0]) {
            // console.log("adding role")
            try {
              let cooldown = guildData.lfgcooldown;
              member.roles.add(bot.lfgroles.get(message.guild.id))
              let current = JSON.parse(guildData.lfgusers)
              // let object = {
              //   userid: message.author.id,
              //   time: Date.now()
              // }
              current.push(message.author.id)
              // bot.lfgusers.set(message.guild.id, current)
              bot.db.prepare("UPDATE guilddata SET lfgusers=? WHERE guildid=?").run(JSON.stringify(current), message.guild.id)
              setTimeout(async () => {
                let current = JSON.parse(guildData.lfgusers)
                // let current = bot.lfgusers.get(message.guild.id)
                let sort = current.find(userid => userid === message.author.id)
                current.splice(current.indexOf(sort), 1)
                // bot.db.prepare("UPDATE guilddata SET lfgusers=? WHERE guildid=?").run(JSON.stringify(current), message.guild.id)
                let member1 = await message.guild.members.fetch(message.author.id)
                if (message.guild.roles.cache.has(bot.lfgroles.get(message.guild.id)) && message.guild.channels.cache.has(guildData.lfgnotifychannel) && guildData.lfgnotifymessage) {
                  let log = message.guild.channels.cache.get(guildData.lfgnotifychannel)
                  log.send(guildData.lfgnotifymessage.replace(/{USER}/g, message.author).replace(/{LFG}/, role)).catch(e => { });
                }
                if (member1.roles.cache.has(message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)).id)) {
                  member1.roles.remove(role.id).catch(e => { console.error(e) })
                }
              }, (cooldown * 3600000));
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription(bot.translate(bot, language, "lookingforgroup.roleadded")
                  .replace(/{CHECK}/g, bot.emoji.check)
                  .replace(/{USER}/g, message.author)
                  .replace(/{ROLE}/g, role)
                  .replace(/{COOLDOWN}/g, cooldown));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            } catch (e) {
              bot.error(bot, message, language, e);
            }
          } else if (member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
            if (args[0] && args[0].toLowerCase() === "list") {
              let data = JSON.parse(guildData.lfgusers)
              // console.log(data)
              let sort = data.find(userid => userid === message.author.id);
              if (sort !== undefined) {
                let memberarray = [];
                let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)) || await message.guild.roles.fetch(bot.lfgroles.get(message.guild.id))
                role.members.forEach(member => {
                  memberarray.push(`${member} (${member.id})`)
                })
                if (data.length === 0) {
                  memberarray = [`*${bot.translate(bot, language, "none")}*`]
                }
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.main)
                  .setDescription(bot.translate(bot, language, "lookingforgroup.memberlist").join("\n")
                    .replace(/{LIST}/g, memberarray.map(m => `**-** ${m}`).join("\n")));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              }
            }
          }
          if (message.member.hasPermission("ADMINISTRATOR") && args[0]) {
            if (args[0].toLowerCase() === "list") {
              let data = JSON.parse(guildData.lfgusers)
              let memberarray = [];
              let role = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id)) || await message.guild.roles.fetch(bot.lfgroles.get(message.guild.id))
              role.members.forEach(member => {
                memberarray.push(`${member} (${member.id})`)
              })
              if (data.length === 0) {
                memberarray = [`*${bot.translate(bot, language, "none")}*`]
              }
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.main)
                .setDescription(bot.translate(bot, language, "lookingforgroup.memberlist").join("\n")
                  .replace(/{LIST}/g, memberarray.map(m => `**-** ${m}`).join("\n")));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }
            if (args[0].toLowerCase() === "removeall") {
              let getrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id))
              if (getrole.members.size <= 0) {
                bot.db.prepare("UPDATE guilddata SET lfgusers=? WHERE guildid=?").run("[]", message.guild.id)
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "lookingforgroup.nouserswithrole")
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{USER}/g, message.author)
                    .replace(/{ROLE}/g, getrole));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              }
              let embed = new Discord.MessageEmbed()
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
                      let oldrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id))
                      let newrole = await message.guild.roles.create({ data: oldrole })
                      oldrole.delete('Magic8 - LFG Remove All Users').then(deleted => {
                        bot.lfgroles.set(message.guild.id, newrole.id)
                        bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run(newrole.id, message.guild.id)
                      }).catch(e => {
                        return bot.error(bot, message, language, e);
                      })
                      let embed = new Discord.MessageEmbed()
                        .setColor(bot.colors.green)
                        .setDescription(bot.translate(bot, language, "lookingforgroup.removedall")
                          .replace(/{CHECK}/g, bot.emoji.check)
                          .replace(/{NEWROLE}/g, newrole))
                      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
                    } catch (e) { return bot.error(bot, message, language, e); }
                  }
                }).catch(collected => {
                  console.log(collected)
                  let oldrole = message.guild.roles.cache.get(bot.lfgroles.get(message.guild.id));
                  m.delete({ timeout: 500 }).catch(e => { });
                  let embed = new Discord.MessageEmbed()
                    .setColor(bot.colors.red)
                    .setDescription(bot.translate(bot, language, "lookingforgroup.didnotconfirm")
                      .replace(/{CROSS}/g, bot.emoji.cross)
                      .replace(/{USER}/g, message.author)
                      .replace(/{ROLE}/g, oldrole))
                  return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
                });
              }).catch(e => { return bot.error(bot, message, language, e); })
            } else if (message.mentions.users) {
              let target;
              try {
                let id = args[0].replace(/[^0-9]/g, "");
                target = message.guild.members.cache.get(id) || await message.guild.members.fetch(id);
              } catch (e) {
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "it")
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{USER}/g, message.author));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
              }
              if (!target) {
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "it")
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{USER}/g, message.author));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
              }
              let member = message.guild.members.cache.get(target.id) || await message.guild.members.fetch(target.id);
              if (member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
                member.roles.remove(bot.lfgroles.get(message.guild.id)).catch(e => { });
                let current = JSON.parse(bot.lfgroles.get(message.guild.id))
                let sort = current.find(userid => userid === target.id)
                if (sort !== undefined) {
                  current.splice(current.indexOf(sort), 1);
                  bot.db.prepare("UPDATE guilddata SET lfgusers=? WHERE guildid=?").run(JSON.stringify(current), message.guild.id);
                }
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.green)
                  .setDescription(bot.translate(bot, language, "lookingforgroup.roleremoved")
                    .replace(/{CHECK}/g, bot.emoji.check)
                    .replace(/{TARGET}/g, target));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              } else if (!member.roles.cache.has(bot.lfgroles.get(message.guild.id))) {
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription(bot.translate(bot, language, "lookingforgroup.alreadynorole")
                    .replace(/{CROSS}/g, bot.emoji.cross)
                    .replace(/{TARGET}/g, target));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              }
            }
          }
        } else if (!message.guild.roles.cache.has(role.id)) {
          bot.lfgroles.delete(message.guild.id)
          return bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run("none", message.guild.id)
        }
      }
    } else if (bot.premium.get(message.guild.id) === 0) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "lookingforgroup.premium").join("\n")
          .replace(/{BOT}/g, bot.user)
          .replace(/{PACKAGES}/g, bot.config.donatelink));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
  }
}