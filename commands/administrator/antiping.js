const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["ap"],
  category: "ADMINISTRATOR",
  description: "Warn people who ping users protected by Anti-Ping and don't have a bypass role\nRequires `Manage Server` Permission",
  emoji: "🔕",
  name: "antiping",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    if (subcommand === "adduser") {
      let max = bot.maxantipingusers.get(bot.premium.get(message.guild.id));
      let users = JSON.parse(guildData.antipingusers);
      if (users.length >= max) {
        let upgradestring;
        if ([0, 1].includes(bot.premium.get(message.guild.id))) {
          upgradestring = bot.translate(bot, language, "antiping.upgrade.description")
            .replace(/{OPTIONS}/g, bot.premium.get(message.guild.id) === 1 ?
              bot.translate(bot, language, "triple") :
              bot.translate(bot, language, "singleortriple"))
            .replace(/{DONATELINK}/g, bot.config.donatelink);
        } else {
          upgradestring = bot.translate(bot, language, "antiping.upgrade.cannotupgrade");
        }
        let array = [];
        users.forEach((item, index) => {
          array.push(`**${index + 1}.** ${bot.users.cache.get(item)}`);
        })
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.reachedlimit").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{MAX}/g, max)
            .replace(/{UPGRADE}/g, upgradestring)
            .replace(/{USERS}/g, array.join("\n")));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!args[1]) {
        let usersarray = [];
        let antipingusers = JSON.parse(guildData.antipingusers);
        antipingusers.forEach(u => {
          usersarray.push(`${bot.users.cache.get(u)} (${u})`);
        })
        if (antipingusers.length === 0) {
          usersarray = [`*${bot.translate(bot, language, "none")}*`];
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "antiping.addusermenutitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setDescription(bot.translate(bot, language, "antiping.addusermenu").join("\n")
            .replace(/{USERS}/g, usersarray.map(u => `**•** ${u}`).join("\n"))
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let target;
      try {
        let id = args[1].replace(/[^0-9]/g, "");
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
      if (target.id === bot.user.id) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.cannotbebot")
            .replace(/{CROSS}/g, bot.emoji.cross));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (users.includes(target.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.targetalreadydisabled")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{TARGET}/g, target));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (!users.includes(target.id)) {
        users.push(target.id);
        bot.antipingusers.set(message.guild.id, users);
        bot.db.prepare("UPDATE guilddata SET antipingusers=? WHERE guildid=?").run(JSON.stringify(users), message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.nowdisabled")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TARGET}/g, target));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "removeuser") {
      if (!bot.antipingusers.has(message.guild.id) || bot.antipingusers.get(message.guild.id).length <= 0) {
        bot.antipingusers.delete(message.guild.id)
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.nousers").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!args[1]) {
        let usersarray = [];
        bot.antipingusers.get(message.guild.id).forEach(async u => {
          let fetched = await bot.users.fetch(u) || bot.users.cache.get(u);
          usersarray.push(`${fetched} (${fetched.id})`);
        });
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "antiping.removeusermenutitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setDescription(bot.translate(bot, language, "antiping.removeusermenu").join("\n")
            .replace(/{USERS}/g, usersarray.length <= 0 ? usersarray.map(u => `**•** ${u}`).join("\n") : `**•** *${bot.translate(bot, language, "none")}*`)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let target;
      if (args[1].toLowerCase() === "all") {
        bot.db.prepare("UPDATE guilddata SET antipingusers=? WHERE guildid=?").run("[]", message.guild.id);
        bot.antipingusers.delete(message.guild.id)
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.removeall")
            .replace(/{CHECK}/g, bot.emoji.check));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      try {
        let id = args[1].replace(/[^0-9]/g, "");
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      } catch (e) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.invaliduser").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!bot.antipingusers.get(message.guild.id).includes(target.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.alreadyenabled")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{TARGET}/g, target))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (bot.antipingusers.get(message.guild.id).includes(target.id)) {

        let removed = bot.antipingusers.get(message.guild.id).filter(id => id !== target.id);
        if (removed.length === 0) {
          bot.antipingusers.delete(message.guild.id);
        } else {
          bot.antipingusers.set(message.guild.id, removed);
        }
        bot.db.prepare("UPDATE guilddata SET antipingusers=? WHERE guildid=?").run(JSON.stringify(removed), message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.nowenabled")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TARGET}/g, target));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "message") {
      let newmessage = args.slice(1).join(" ").replace(/@everyone/gi, "<everyone>").replace(/@here/gi, "<here>");
      let oldmessage = guildData.antipingmessage;
      if (!newmessage) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setAuthor(bot.translate(bot, language, "antiping.messageinfotitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setDescription(bot.translate(bot, language, "antiping.messageinfo").join("\n")
            .replace(/{CURRENTMESSAGE}/g, oldmessage)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "antiping.messageupdated").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{OLDMESSAGE}/g, oldmessage)
          .replace(/{NEWMESSAGE}/g, newmessage));
      bot.db.prepare("UPDATE guilddata SET antipingmessage=? WHERE guildid=?").run(newmessage, message.guild.id);
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "addrole") {
      let targetrole;
      try {
        let id = args[1].replace(/[^0-9]/g, "");
        targetrole = message.guild.roles.cache.get(id) || await message.guild.roles.fetch(id);
      } catch (e) {
        let rolesarray = [];
        let getroles = message.guild.roles.cache.keyArray();
        getroles.forEach(roleid => {
          rolesarray.push(`${message.guild.roles.cache.get(roleid)} (${roleid})`);
        })
        if (getroles.length === 0) {
          rolesarray = [`*${bot.translate(bot, language, "none")}*`];
        }
        let mapped = rolesarray;
        let roleslength = mapped.length;
        let math = roleslength / 8;
        let fullpagecount = Math.floor(math);
        let totalpages;
        if (!Number.isInteger(math)) {
          totalpages = fullpagecount + 1;
        } else {
          totalpages = fullpagecount;
        }
        let page = 1;
        let lastitemindex = page * 8;
        let selectedroles = [];
        for (map of mapped) {
          if (page === totalpages) {
            if (mapped.indexOf(map) + 1 <= roleslength && mapped.indexOf(map) + 1 > fullpagecount * 8) {
              selectedroles.push(map);
            }
          }
          if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 8) {
            if (!selectedroles.includes(map)) selectedroles.push(map);
          }
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setFooter(bot.translate(bot, language, "antiping.rolepagefooter")
            .replace(/{PAGE}/g, page)
            .replace(/{TOTALPAGES}/g, totalpages))
          .setDescription(bot.translate(bot, language, "antiping.noroleprovided").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{ROLES}/g, selectedroles.map(r => `**•** ${r}`).join("\n"))
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!targetrole.id && !Number.isInteger(parseInt(args[1]))) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.invalidrole").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[1])
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (Number.isInteger(parseInt(args[1]))) {
        let rolesarray = [];
        let getroles = message.guild.roles.cache.keyArray();
        getroles.forEach(roleid => {
          rolesarray.push(`${message.guild.roles.cache.get(roleid)} (${roleid})`);
        })
        if (getroles.length === 0) {
          rolesarray = [`*${bot.translate(bot, language, "none")}*`];
        }
        let mapped = rolesarray;
        let roleslength = mapped.length;
        let math = roleslength / 8;
        let fullpagecount = Math.floor(math);
        let totalpages;
        if (!Number.isInteger(math)) {
          totalpages = fullpagecount + 1;
        } else {
          totalpages = fullpagecount;
        }
        let page = args[1] ? Math.abs(Math.floor(parseInt(args[1]))) : 1;
        if (isNaN(page) || page > totalpages || page < 1) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "antiping.invalidpage").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, args[1])
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{TOTALPAGES}/g, totalpages));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let lastitemindex = page * 8;
        let selectedroles = [];
        for (map of mapped) {
          if (page === totalpages) {
            if (mapped.indexOf(map) + 1 <= roleslength && mapped.indexOf(map) + 1 > fullpagecount * 8) {
              selectedroles.push(map);
            }
          }
          if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 8) {
            if (!selectedroles.includes(map)) selectedroles.push(map);
          }
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setFooter(bot.translate(bot, language, "antiping.rolepagefooter")
            .replace(/{PAGE}/g, page)
            .replace(/{TOTALPAGES}/g, totalpages))
          .setDescription(bot.translate(bot, language, "antiping.rolepage").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{ROLES}/g, selectedroles.map(r => `**•** ${r}`).join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let bypassroles = JSON.parse(guildData.antipingbypassroles);
      if (bypassroles.includes(targetrole.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.alreadybypass").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{TARGETROLE}/g, targetrole)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (!bypassroles.includes(targetrole.id)) {
        bypassroles.push(targetrole.id)
        bot.antipingbypassroles.set(message.guild.id, bypassroles)
        bot.db.prepare("UPDATE guilddata SET antipingbypassroles=? WHERE guildid=?").run(JSON.stringify(bypassroles), message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.nowbypass").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TARGETROLE}/g, targetrole)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "removerole") {
      let bypassroles = JSON.parse(guildData.antipingbypassroles);
      if (bypassroles.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.noroles").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let targetrole;
      try {
        let id = args[1].replace(/[^0-9]/g, "");
        targetrole = message.guild.roles.cache.get(id) || await message.guild.roles.fetch(id);
      } catch (e) {
        let rolesarray = [];
        let getroles = message.guild.roles.cache.keyArray();
        getroles.forEach(roleid => {
          if (bypassroles.includes(roleid)) {
            rolesarray.push(`${message.guild.roles.cache.get(roleid)}(${roleid})`);
          }
        })
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.invalidbypassrole").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{BYPASSROLES}/g, rolesarray.map(r => `**•** ${r}`).join("\n")));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!bypassroles.includes(targetrole.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.alreadydoesnotbypass").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TARGETROLE}/g, targetrole)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (bypassroles.includes(targetrole.id)) {
        let removed = bypassroles.filter(r => r !== targetrole.id);
        if (bot.antipingbypassroles.has(message.guild.id)) {
          bot.antipingbypassroles.set(message.guild.id, removed);
          if (bot.antipingbypassroles.get(message.guild.id).length === 0) {
            bot.antipingbypassroles.delete(message.guild.id);
          }
        }
        bot.db.prepare("UPDATE guilddata SET antipingbypassroles=? WHERE guildid=?").run(JSON.stringify(removed), message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.nolongerbypass").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TARGETROLE}/g, targetrole)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "roles") {
      let bypassarray = []
      let bypassroles = JSON.parse(guildData.antipingbypassroles)
      bypassroles.forEach(async roleid => {
        let role;
        try {
          role = message.guild.roles.cache.get(roleid) || await message.guild.roles.fetch(roleid)
        } catch (e) { }
        bypassarray.push(`${role}(${role.id})`)
      })
      if (bypassarray.length === 0) {
        bypassarray = [`*${bot.translate(bot, language, "none")}*`];
        bot.antipingbypassroles.delete(message.guild.id);
      }
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "antiping.viewrolestitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "antiping.viewroles").join("\n")
          .replace(/{BYPASSROLES}/g, bypassarray.map(r => `**•** ${r}`).join("\n")))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "users") {
      let usersarray = []
      let users = JSON.parse(guildData.antipingusers)
      users.forEach(async userid => {
        let user;
        try {
          user = bot.users.cache.get(userid) || await bot.users.fetch(userid)
        } catch (e) { }
        usersarray.push(`${user}(${user.id})`)
      })
      if (usersarray.length === 0) {
        usersarray = [`*${bot.translate(bot, language, "none")}*`];
        bot.antipingusers.delete(message.guild.id);
      }
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "antiping.viewuserstitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.main)
        .setDescription(bot.translate(bot, language, "antiping.viewusers").join("\n")
          .replace(/{USERS}/g, usersarray.map(u => `**•** ${u}`).join("\n")))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "logchannel") {
      if (args[1] && args[1].toLowerCase() === "remove") {
        if (guildData.antipinglogchannel === "none") {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "antiping.logchannelnotset").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.antipinglogchannels.delete(message.guild.id)
        bot.db.prepare("UPDATE guilddata SET antipinglogchannel=? WHERE guildid=?").run("none", message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "antiping.logchannelremove").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      bot.antipinglogchannels.set(message.guild.id, message.channel.id)
      bot.db.prepare("UPDATE guilddata SET antipinglogchannel=? WHERE guildid=?").run(message.channel.id, message.guild.id);
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "antiping.logchannelset").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{CHANNEL}/g, message.channel)
          .replace(/{CHANNELID}/g, message.channel.id)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "antiping.menutitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.main)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(bot.translate(bot, language, "antiping.menu").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{WARNING}/g, bot.emoji.warning)
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}