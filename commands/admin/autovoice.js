const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["av"],
  category: "ADMIN",
  description: "Create Automatic Voice Channels - Requires `Manage Server` Permission",
  emoji: "🔊",
  name: "autovoice",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    if (subcommand === "create") {
      if (guildData.autovoicecategory === "none") {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.nocategory").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let max = bot.maxautovoicechannels.get(bot.premium.get(message.guild.id));
      let getautochannels = JSON.parse(guildData.autovoicechannels);
      if (getautochannels.length >= max) {
        let upgradestring;
        if ([0, 1].includes(bot.premium.get(message.guild.id))) {
          upgradestring = bot.translate(bot, language, "autovoice.upgrade.description")
            .replace(/{OPTIONS}/g, bot.premium.get(message.guild.id) === 1 ?
              bot.translate(bot, language, "autovoice.upgrade.triple") :
              bot.translate(bot, language, "autovoice.upgrade.singleortriple"))
            .replace(/{DONATELINK}/g, bot.config.donatelink);
        } else {
          upgradestring = bot.translate(bot, language, "autovoice.upgrade.cannotupgrade");
        }
        let available = [];
        getautochannels.forEach(c => {
          available.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(c.id).name} (${c.id})`);
        })
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "antiping.reachedlimit").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{MAX}/g, max)
            .replace(/{UPGRADE}/g, upgradestring)
            .replace(/{CURRENTCHANNELS}/g, available.map(a => `**•** ${a}`).join("\n")))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let types = ["duo", "trio", "squad"]
      if (!args[1]) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "autovoice.notypetitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setDescription(bot.translate(bot, language, "autovoice.notype").join("\n")
            .replace(/{TYPES}/g, types.map(t => `\`${t}\``).join(" ")))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!types.includes(args[1].toLowerCase())) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.invalidtype").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[1])
            .replace(/{TYPES}/g, types.map(t => `\`${t}\``).join(" ")))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (args[1].toLowerCase() === "duo") {
        let voicechannels = JSON.parse(guildData.autovoicechannels);
        let category = guildData.autovoicecategory;
        let opts = {
          type: "voice",
          parent: category,
        };
        try {
          let created = await message.guild.channels.create(`[DUO]`, opts);
          let object = {
            id: created.id,
            type: "Duo",
            limit: 2
          }
          voicechannels.push(object);
          bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(1, message.guild.id);
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(voicechannels), message.guild.id);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription(bot.translate(bot, language, "autovoice.created").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{TYPE}/g, bot.translate(bot, language, "autovoice.type.duo"))
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } catch (e) { return bot.error(bot, message, language, e); }
      } else if (args[1].toLowerCase() === "trio") {
        let voicechannels = JSON.parse(guildData.autovoicechannels);
        let category = guildData.autovoicecategory;
        let opts = {
          type: "voice",
          parent: category,
        };
        try {
          let created = await message.guild.channels.create(`[TRIO]`, opts);
          let object = {
            id: created.id,
            type: "Trio",
            limit: 3
          }
          voicechannels.push(object)
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(voicechannels), message.guild.id);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription(bot.translate(bot, language, "autovoice.created").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{TYPE}/g, bot.translate(bot, language, "autovoice.type.trio"))
              .replace(/{INFO}/g, bot.emoji.info))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } catch (e) { return bot.error(bot, message, language, e); }
      } else if (args[1] === "squad") {
        let voicechannels = JSON.parse(guildData.autovoicechannels);
        let category = guildData.autovoicecategory;
        let opts = {
          type: "voice",
          parent: category,
        };
        try {
          let created = await message.guild.channels.create(`[SQUAD]`, opts);
          let object = {
            id: created.id,
            type: "Squad",
            limit: 4
          }
          voicechannels.push(object);
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(voicechannels), message.guild.id);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription(bot.translate(bot, language, "autovoice.created").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{TYPE}/g, bot.translate(bot, language, "autovoice.type.squad"))
              .replace(/{INFO}/g, bot.emoji.info))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } catch (e) { return bot.error(bot, message, language, e); }
      }
    } else if (subcommand === "delete") {
      let getautochannels = JSON.parse(guildData.autovoicechannels);
      let a = [];
      let available = [];
      if (getautochannels.length <= 0) {
        available = [`*${bot.translate(bot, language, "none")}*`];
      } else {
        getautochannels.forEach(vc => {
          a.push(vc.id)
          available.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(vc.id).name} (${vc.id})`);
        })
      }
      if (!args[1] || (args[1] && !a.includes(args[1]))) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.invalidchannel").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[1])
            .replace(/{AVAILABLE}/g, available.map(a => `**•** ${a}`).join("\n")))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else {
        try {
          let vc = getautochannels.find(i => i.id === args[1]);
          getautochannels.splice(getautochannels.indexOf(vc), 1);
          let todelete = bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]);
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(getautochannels), message.guild.id);
          if (getautochannels.length <= 0) {
            bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(0, message.guild.id);
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription(bot.translate(bot, language, "autovoice.noneleft").join("\n")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{DELETED}/g, todelete.name)
                .replace(/{WARNING}/g, bot.emoji.warning));
            message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            return todelete.delete();
          } else {
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription(bot.translate(bot, language, "autovoice.deleted").join("\n")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{DELETED}/g, todelete.name));
            message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            return todelete.delete();
          }
        } catch (e) { return bot.error(bot, message, language, e); }
      }
    } else if (subcommand === "reset") {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "autovoice.confirmreset").join("\n")
          .replace(/{WARNING}/g, bot.emoji.warning)
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).then(msg => {
        const filter = m => m.author.id === message.author.id && message.content;
        return message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
          let confirm = collected.first().content.toLowerCase() === "confirm";
          if (confirm) {
            try {
              let channels = [];
              bot.avtempchannels.get(message.guild.id).forEach(async channel => {
                channels.push(`${channel.type} ${message.guild.channels.cache.get(channel.id)}`);
                await message.guild.channels.cache.get(channel.id).delete();
              });
              bot.avtempchannels.delete(message.guild.id);
              bot.duo.delete(message.guild.id);
              bot.trio.delete(message.guild.id);
              bot.squad.delete(message.guild.id);
              if (channels.length <= 0) channels = bot.translate(bot, language, "none");
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription(bot.translate(bot, language, "autovoice.resetconfirmed").join("\n")
                  .replace(/{CHECK}/g, bot.emoji.check)
                  .replace(/{CHANNELSDELETED}/g, channels.map(c => `**•** ${c}`)));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            } catch (e) { return bot.error(bot, message, language, e); }
          }
        }).catch(collected => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "autovoice.didnotconfirm")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, message.author));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        })
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "name") {
      if ([1, 2].includes(bot.premium.get(message.guild.id))) {
        let nicetypes = ["Duo", "Trio", "Squad"];
        let types = ["duo", "trio", "squad"];
        if (!args[1]) {
          let embed = new MessageEmbed()
            .setColor(bot.colora.main)
            .setAuthor(bot.translate(bot, language, "autovoice.namemenutitle")
              .replace(/{BOTNAME}/g, bot.user.username))
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setDescription(bot.translate(bot, language, "autovoice.namemenu").join("\n")
              .replace(/{TYPES}/g, types.map(t => `**•** ${t}`).join("\n"))
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (!types.includes(args[1].toLowerCase())) {
          let embed = new MessageEmbed()
            .setColor(bot.colora.main)
            .setDescription(bot.translate(bot, language, "autovoice.nameinvalidtype").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, args[1])
              .replace(/{TYPES}/g, types.map(t => `**•** ${t}`).join("\n"))
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let name = args.slice(2).join(" ");
        if (name.length - 8 > 8) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "autovoice.nametoolong").join("\n")
              .replace(/{CROSS/g, bot.emoji.cross)
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (!["{NUMBER}"].includes(name)) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "autovoice.nonumberwritten").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.db.prepare(`UPDATE guilddata SET ${args[1].toLowerCase()}name=? WHERE guildid=?`).run(`${name}`, message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "autovoice.nameupdated").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{TYPE}/g, nicetypes[types.indexOf(args[1].toLowerCase()) + 1])
            .replace(/{NEWNAME}/g, name)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (bot.premium.get(message.guild.id) === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription([
            `💎 **Premium Feature** 💎`,
            ``,
            `Customizing the name of generated channels from AVC is premium! Support the developers and motivate them to continue investing hours a day into ${bot.user}. View the available packages [here](${bot.config.donatelink}).`]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "cooldown") {
      if (!args[1]) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "autovoice.nocooldowntitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "autovoice.nocooldown").join("\n")
            .replace(/{COOLDOWN}/g, guildData.autovoicecooldown)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let cooldown = parseInt(Math.abs(Math.floor(args[1])));
      if (isNaN(cooldown)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.notanumber")
            .replace(/{USER}/g, message.author)
            .replace(/{CROSS}/g, bot.emoji.cross));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (cooldown < 10) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.toosmall")
            .replace(/{USER}/g, message.author)
            .replace(/{CROSS}/g, bot.emoji.cross));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (cooldown > 300) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.toolarge")
            .replace(/{USER}/g, message.author)
            .replace(/{CROSS}/g, bot.emoji.cross));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "cooldownupdated").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{OLDCOOLDOWN}/g, guildData.autovoicecooldown)
          .replace(/{NEWCOOLDOWN}/g, cooldown));
      bot.db.prepare("UPDATE guilddata SET autovoicecooldown=? WHERE guildid=?").run(cooldown, message.guild.id)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "info") {
      let voicechannels = JSON.parse(guildData.autovoicechannels);
      let category = guildData.autovoicecategory;
      let voicecategory;
      let enabled = guildData.autovoicesystemready ?
        bot.translate(bot, language, "true") :
        bot.translate(bot, language, "false");
      let thechannels = [];
      if (category === "none") {
        voicecategory = bot.translate(bot, language, "none")
      } else {
        voicecategory = `${bot.guilds.cache.get(message.guild.id).channels.cache.get(category).name} (${category})`;
      }
      if (voicechannels.length >= 1 && category !== "none") {
        voicechannels.forEach(vc => {
          thechannels.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(vc.id).name} (${vc.id})`);
        });
      } else {
        thechannels = [`*${bot.translate(bot, language, "none")}*`]
      }
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "autovoice.infotitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setDescription(bot.translate(bot, language, "autovoice.info").join("\n")
          .replace(/{ENABLED}/g, enabled)
          .replace(/{CATEGORY}/g, voicecategory)
          .replace(/{COOLDOWN}/g, guildData.autovoicecooldown)
          .replace(/{CHANNELS}/g, thechannels.map(c => `**•** ${c}`).join("\n")));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "category") {
      if (!args[1]) {
        if (guildData.autovoicecategory === "none") {
          let category = "not set";
          let embed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setAuthor(bot.translate(bot, language, "autovoice.viewcategorytitle")
              .replace(/{BOTNAME}/g, bot.user.username))
            .setDescription(bot.translate(bot, language, "autovoice.viewnocategory").join("\n")
              .replace(/{CATEGORY}/g, category)
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else {
          let category = guildData.autovoicecategory;
          let embed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setDescription(bot.translate(bot, language, "autovoice.viewcategory").join("\n")
              .replace(/{CATEGORY}/g, bot.guilds.cache.get(message.guild.id).channels.cache.get(category))
              .replace(/{CATEGORYID}/g, category)
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      }
      if (args[1].toLowerCase() === "clear") {
        if (guildData.autovoicecategory === "none") {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "autovoice.alreadydisabled").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else {
          bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(0, message.guild.id);
          bot.db.prepare("UPDATE guilddata SET autovoicecategory=? WHERE guildid=?").run("none", message.guild.id);
          bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run("[]", message.guild.id);
          // bot.db.prepare("UPDATE guilddata SET tempchannels=? WHERE guildid=?").run("[]", message.guild.id);
          bot.avcategories.delete(message.guild.id);
          bot.avtempchannels.delete(message.guild.id);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription(bot.translate(bot, language, "autovoice.disabled").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      }
      let possiblechannel;
      try {
        possiblechannel = await message.guild.channels.cache.get(args[1]) || message.guild.channels.fetch(args[1])
      } catch (e) { }
      if (!possiblechannel || possiblechannel.type !== "category") {
        let allchannels = bot.guilds.cache.get(message.guild.id).channels.cache.keyArray();
        let categoriesarray = [];
        allchannels.forEach(c => {
          if (bot.channels.cache.get(c).type === "category") {
            categoriesarray.push(`${bot.channels.cache.get(c)} (${c})`);
          }
        })
        if (categoriesarray.length === 0) {
          categoriesarray = [`*${bot.translate(bot, language, "none")}*`];
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.notacategory").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{CATEGORIES}/g, categoriesarray.map(c => `**•** ${c}`).join("\n")));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let permissionsInChannel = message.guild.me.permissionsIn(possiblechannel)
      if (!permissionsInChannel || !permissionsInChannel.has(["MANAGE_CHANNELS", "MOVE_MEMBERS"])) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "autovoice.nopermissionincategory").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{BOT}/g, bot.user));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      bot.db.prepare("UPDATE guilddata SET autovoicecategory=? WHERE guildid=?").run(possiblechannel.id, message.guild.id);
      bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(1, message.guild.id);
      bot.avcategories.set(message.guild.id, possiblechannel.id);
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "autovoice.categoryset").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{CATEGORY}/g, bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]))
          .replace(/{CATEGORYID}/g, args[1])
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "autovoice.helptitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setThumbnail(bot.user.displayAvatarURL({ formant: "png" }))
        .setDescription(bot.translate(bot, language, "autovoice.help").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
} 