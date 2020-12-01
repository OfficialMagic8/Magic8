const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["t"],
  category: "UTILITIES",
  description: "Advanced Tickets System - Requires `Aministrator` Permission To Setup",
  emoji: "🎟️",
  name: "ticket",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    // let language = bot.utils.getLanguage(bot, guildData.language);
    // let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    // if (subcommand === "toggle" && message.member.hasPermission("ADMINISTRATOR")) {
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   if (guildData.ticketstatus === 0) {
    //     bot.database.prepare("UPDATE guilddata SET ticketstatus=? WHERE guildid=?").run(1, message.guild.id);
    //     let enabled = new MessageEmbed()
    //       .setColor(bot.colors.green)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.toggle.enabled").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{INFO}/g, bot.emoji.info).replace(/{PREFIX}/g, prefix).replace(/{CHECK}/g, bot.emoji.check))
    //     return message.channel.send(enabled).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   } else {
    //     bot.database.prepare("UPDATE guilddata SET ticketstatus=? WHERE guildid=?").run(0, message.guild.id);
    //     let disabled = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.toggle.disabled").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{INFO}/g, bot.emoji.info).replace(/{PREFIX}/g, prefix).replace(/{CHECK}/g, bot.emoji.check))
    //     return message.channel.send(disabled).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    // }
    // if (guildData.ticketstatus === 0) {
    //   if (message.member.hasPermission("ADMINISTRATOR")) {
    //     message.delete({ timeout: 500 }).catch(console.error)
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.disabled").replace(/{CROSS}/g, bot.emoji.cross).replace(/{PREFIX}/g, prefix))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 10000 }).catch(console.error));
    //   }
    //   return;
    // } else {
    //   if (guildData.ticketchannelid !== "none") {
    //     if (guildData.ticketchannelid !== message.channel.id && message.member.hasPermission("ADMINISTRATOR")) return;
    //   }
    // }
    // let type = guildData.tickettype
    // if (!subcommand) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let help = new MessageEmbed()
    //     .setAuthor(bot.utils.getTranslation(bot, language, "ticket.help.title").replace(/{BOTNAME}/g, bot.user.username))
    //     .setThumbnail(bot.user.displayAvatarURL())
    //     .setDescription(bot.utils.getTranslation(bot, language, `ticket.help.${message.member.hasPermission("ADMINISTRATOR") ? "administrator" : "user"}.description`).join("\n")
    //       .replace(/{TICKETNEW}/g, type === 0 ? bot.utils.getTranslation(bot, language, "ticket.help.ticketnew") : "")
    //       .replace(/{PREFIX}/g, prefix).replace(/{WARNING}/g, bot.emoji.warning)
    //       .replace(/{GITHUBLINK}/g, bot.config.github.main).replace(/{INVITE}/g, bot.invite))
    //     .setColor(bot.colors.gold)
    //   return message.channel.send(help).catch(console.error).then(m => m.delete({ timeout: 60000 }).catch(console.error))
    // }
    // if (subcommand === "new" && type === 0) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let category = message.guild.channels.cache.get(guildData.ticketcategoryid)
    //   if (!category || category.type !== "category") {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.new.notsetup").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{INFO}/g, bot.emoji.info))
    //     return message.channel.send(error).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    //   }
    //   let ticketNameCheck = `ticket-${message.author.id}`;
    //   let ticketmaxamount = guildData.ticketmaxamount;
    //   // let ticketsupportroleid = guildData.supportroleid;
    //   let actualOpenedTickets = message.guild.channels.cache.filter(c => c.name.startsWith(ticketNameCheck));
    //   let actualTicketsAmount = actualOpenedTickets.size;
    //   let currentticket = 1
    //   if (actualOpenedTickets.size >= 1) {
    //     if (actualTicketsAmount >= guildData.ticketmaxamount) {
    //       let error = new MessageEmbed()
    //         .setColor(bot.colors.red)
    //         .setDescription(bot.utils.getTranslation(bot, language, "ticket.new.maxtickets").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //           .replace(/{AMOUNT}/g, ticketmaxamount).replace(/{INFO}/g, bot.emoji.info))
    //       return message.channel.send(error).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    //     }
    //     let amounts = actualOpenedTickets.filter(c => {
    //       let parts = c.name.split("-");
    //       if (parts.length == 3) {
    //         let index = parts[2];
    //         return !isNaN(index);
    //       } else {
    //         return false;
    //       }
    //     }).map(Number);
    //     let maxIndex = Math.max.apply(null, amounts)
    //     currentticket = maxIndex + 1;
    //   } else {
    //     currentticket = 1;
    //   }
    //   bot.utils.attemptOpenTicket(bot, message.guild, message.member, category, language, guildData, currentticket, message.channel);
    //   return;
    // } else if (subcommand === "close") {
    //   if (!message.channel.name.match(/^ticket-[0-9]{18}($|-[0-9]+$)/i)) return;
    //   if (!message.channel.name.includes(message.author.id) || !message.member.roles.cache.has(guildData.supportroleid) || !message.member.hasPermission("ADMINISTRATOR")) return;
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   if (bot.closingtickets.has(message.channel.id)) {
    //     let object = bot.closingtickets.get(message.channel.id);
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.close.alreadyclosing").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{USER}/g, object.executor.user).replace(/{ID}/g, object.executor.user.id).replace(/{INFO}/g, bot.emoji.info))
    //     return message.channel.send(error).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    //   }
    //   try {
    //     await message.channel.send(bot.utils.getTranslation(bot, language, "ticket.close.closing").replace(/{CROSS}/g, bot.emoji.cross)).catch(console.error)
    //   } catch (e) { }
    //   let object = {
    //     executor: {
    //       username: message.author.username,
    //       id: message.author.id,
    //       tag: message.author.tag,
    //       user: message.author
    //     }
    //   }
    //   bot.closingtickets.set(message.channel.id, object);
    //   let createdAt = message.channel.createdTimestamp;
    //   let fetchedMessages = await bot.utils.fetchMessages(undefined, message.channel);
    //   let successfile = false;
    //   let creatorid = message.channel.name.replace(/^ticket-|(-[0-9a-z]+)/gi, "");
    //   let creator;
    //   if (bot.users.cache.has(creatorid)) {
    //     creator = bot.users.cache.get(creatorid);
    //   } else {
    //     try {
    //       creator = await bot.users.fetch(creatorid);
    //     } catch (e) { }
    //   }
    //   let creationdate = message.channel.createdAt.toLocaleString().split("GMT")[0].trim()
    //   let currentdate = (new Date()).toLocaleString().split("GMT")[0].trim();
    //   let filename = `${creatorid}`
    //   let creationago = bot.ms(Date.now() - createdAt);
    //   let finalDoc = `Transcription from ticket #${message.channel.name}` +
    //     `\r\nCreated by: ${creator ? creator.tag : "Unknown User#0000"} (${creatorid})` +
    //     `\r\nClosed by: ${message.author.tag} (${message.author.id})` +
    //     `\r\nCreation date: ${creationdate} (${creationago} ago)` +
    //     `\r\nClose date: ${currentdate}` +
    //     `\r\nMessages amount: ${fetchedMessages.size}` +
    //     `\r\n\r\n` +
    //     fetchedMessages.array().reverse().map(m => `(${m.author.id})[${m.createdAt.toLocaleString().split("GMT")[0].trim()}] ${m.author.tag}: ${m.content} ${m.attachments.size === 0 ? "" : `(Files: ${m.attachments.map(attach => attach.proxyURL).join(", ")} )`}`).join("\r\n") +
    //     `\r\n\r\nTranscription system by AlonsoAliaga#0017 (290640988677079041)` +
    //     `\r\nMore information: https://alonsoaliaga.github.io/`
    //   let tickettemplate = bot.tickettemplate + 0;
    //   bot.tickettemplate++;
    //   if (bot.tickettemplate > 5) {
    //     bot.tickettemplate = 0;
    //   }
    //   try {
    //     bot.fs.writeFileSync(`././templates/${creatorid}_${tickettemplate}.txt`, finalDoc, 'utf8')
    //     successfile = true;
    //   } catch (e) { }
    //   message.channel.delete().then(() => {
    //     bot.closingtickets.delete(message.channel.id)
    //     let ticketslog = message.guild.channels.cache.get(guildData.ticketslogchannelid)
    //     if (ticketslog) {
    //       let embed = new MessageEmbed()
    //         .setAuthor(bot.utils.getTranslation(bot, language, "ticket.close.closed.title"), "https://cdn.discordapp.com/emojis/690971830433087599.png", null)
    //         .setDescription(bot.utils.getTranslation(bot, language, "ticket.close.closed.description" + (successfile ? "" : "error")).join("\n")
    //           .replace(/{CREATOR}/g, creator ? creator : "Unknown User#0000").replace(/{CREATORID}/g, creatorid)
    //           .replace(/{SOLVER}/g, message.author).replace(/{SOLVERID}/g, message.author.id)
    //           .replace(/{CREATIONAGO}/g, creationago).replace(/{CREATIONDATE}/g, creationdate))
    //         .setColor(bot.colors.red)
    //       if (successfile) {
    //         ticketslog.send("", {
    //           embed: embed,
    //           files: [{
    //             attachment: `././templates/${creatorid}_${tickettemplate}.txt`,
    //             name: `${filename}.txt`
    //           }]
    //         }).catch(console.error)
    //       } else {
    //         ticketslog.send(embed).catch(console.error)
    //       }
    //     } else {
    //       let embed = new MessageEmbed()
    //         .setAuthor(bot.utils.getTranslation(bot, language, "ticket.close.closed.title"), "https://cdn.discordapp.com/emojis/690971830433087599.png", null)
    //         .setDescription(bot.utils.getTranslation(bot, language, "ticket.close.closed.description" + (successfile ? "" : "error")).join("\n")
    //           .replace(/{CREATOR}/g, creator ? creator : "Unknown User#0000").replace(/{CREATORID}/g, creatorid)
    //           .replace(/{SOLVER}/g, message.author).replace(/{SOLVERID}/g, message.author.id)
    //           .replace(/{CREATIONAGO}/g, creationago).replace(/{CREATIONDATE}/g, creationdate))
    //         .setColor(bot.colors.red)
    //       if (successfile) {
    //         message.author.send("", {
    //           embed: embed,
    //           files: [{
    //             attachment: `././templates/${creatorid}_${tickettemplate}.txt`,
    //             name: `${filename}.txt`
    //           }]
    //         }).catch(console.error)
    //       } else {
    //         message.author.send(embed).catch(console.error)
    //       }
    //     }
    //   }).catch(e => {
    //     bot.closingtickets.delete(message.channel.id)
    //     console.log(e.message);
    //     return message.channel.send(bot.utils.getTranslation(bot, language, "ticket.close.errorclosing").replace(/{CROSS}/g, bot.emoji.cross)).then(m => m.delete({ timeout: 7500 }).catch(console.error));
    //   });

    // } else if (subcommand === "setup" && message.member.hasPermission("ADMINISTRATOR")) {
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let ready = false;
    //   let category = message.guild.channels.cache.find(c => c.id === guildData.ticketcategoryid && c.type === "category");
    //   let ticketcategorystatus = category ? true : false;
    //   let ticketmessageid = guildData.ticketmessageid === "none" ? false : true
    //   let ticketstatus = guildData.ticketstatus === 0 ? false : true
    //   let supportRole = message.guild.roles.cache.get(guildData.supportroleid);
    //   let ticketchannel = message.guild.channels.cache.find(c => c.id === guildData.ticketchannelid && c.type === "text");
    //   let ticketlogchannel = message.guild.channels.cache.find(c => c.id === guildData.ticketslogchannelid && c.type === "text");
    //   let messagestatus = guildData.ticketmessage !== "none";

    //   if (ticketcategorystatus && ticketstatus && supportRole && ticketlogchannel) {
    //     if (guildData.tickettype === 1) {   //Reaction
    //       if (ticketmessageid) {
    //         ready = true;
    //         bot.database.prepare("UPDATE guilddata SET ticketsystemready=? WHERE guildid=?").run(1, message.guild.id);
    //         let def = {
    //           guild_id: message.guild.id,
    //           channel_id: guildData.ticketmessagechannelid,
    //           message_id: guildData.ticketmessageid,
    //           type: 1,
    //           amount: guildData.ticketmaxamount
    //         }
    //         bot.ticketreactionmap.set(message.guild.id, def)
    //       } else {
    //         bot.ticketreactionmap.delete(message.channel.id)
    //         bot.database.prepare("UPDATE guilddata SET ticketsystemready=? WHERE guildid=?").run(0, message.guild.id);
    //       }
    //     } else { //Command
    //       ready = true;
    //     }
    //   } else if (guildData.tickettype === 1) {
    //     bot.database.prepare("UPDATE guilddata SET ticketsystemready=? WHERE guildid=?").run(0, message.guild.id);
    //   }
    //   let check = bot.emoji.check
    //   let cross = bot.emoji.cross
    //   let information = new MessageEmbed()
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setup.description").join("\n")
    //       .replace(/{TICKETCATEGORYSTATUS}/g, ticketcategorystatus ? check : cross).replace(/{TICKETSTATUS}/g, ticketstatus ? check : cross)
    //       .replace(/{SUPPORTROLESTATUS}/g, supportRole ? check : cross).replace(/{LOGCHANNELSTATUS}/g, ticketlogchannel ? check : cross)
    //       .replace(/{CHANNELSTATUS}/g, ticketchannel ? check : bot.emoji.return).replace(/{MESSAGESTATUS}/g, messagestatus ? check : bot.emoji.return)
    //       .replace(/{REACTIONMESSAGESTATUS}/g, ticketmessageid ? check : cross)
    //       .replace(/{GENERALSTATUS}/g, ready ? bot.utils.getTranslation(bot, language, "ticket.setup.enabled") : bot.utils.getTranslation(bot, language, "ticket.setup.disabled"))
    //       .replace(/{MAGIC8}/g, bot.emoji.magic8).replace(/{CROSS}/g, bot.emoji.cross)
    //       .replace(/{INFO}/g, bot.emoji.info).replace(/{RETURN}/g, bot.emoji.return)
    //       .replace(/{PREFIX}/g, prefix).replace(/{CHECK}/g, bot.emoji.check))
    //     .setColor(ready ? bot.colors.green : bot.colors.red)
    //   return message.channel.send(information).then(m => m.delete({ timeout: 60000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "setmaxtickets" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let amount = args[0];
    //   if (!amount || isNaN(amount)) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.amount.error").join("\n").replace(/{CROSS}/g, bot.emoji.cross))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   if (amount < 1 || amount > 20) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.amount.errorbounds").join("\n").replace(/{CROSS}/g, bot.emoji.cross))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   amount = parseInt(args[0]);
    //   bot.database.prepare("UPDATE guilddata SET ticketmaxamount=?,ticketsystemready=? WHERE guildid=?").run(amount, 0, message.guild.id);
    //   let success = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.amount.success").join("\n")
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{AMOUNT}/g, amount))
    //   return message.channel.send(success).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "logchannel" && message.member.hasPermission("ADMINISTRATOR")) {
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let clear = args[1] && args[1].toLowerCase() === "clear";
    //   bot.database.prepare("UPDATE guilddata SET ticketslogchannelid=?,ticketsystemready=? WHERE guildid=?").run(clear ? "none" : message.channel.id, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, `ticket.setlogchannel.${clear ? "cleared" : "selected"}`).join("\n")
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{PREFIX}/g, prefix).replace(/{INFO}/g, bot.emoji.info).replace(/{CHANNEL}/g, message.channel).replace(/{CROSS}/g, bot.emoji.cross))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "setchannel" && message.member.hasPermission("ADMINISTRATOR")) {
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let clear = args[1] && args[1].toLowerCase() === "clear";
    //   bot.database.prepare("UPDATE guilddata SET ticketchannelid=?,ticketsystemready=? WHERE guildid=?").run(clear ? "none" : message.channel.id, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, `ticket.setchannel.${clear ? "cleared" : "selected"}`).join("\n")
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{INFO}/g, bot.emoji.info).replace(/{PREFIX}/g, prefix).replace(/{CHANNEL}/g, message.channel))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "category" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let categoryid = args[1];
    //   if (!categoryid || !message.guild.channels.cache.has(categoryid) || message.guild.channels.cache.get(categoryid).type !== "category") {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setcategory.error").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{PREFIX}/g, prefix).replace(/{INFO}/g, bot.emoji.info))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   let ticketCategory = message.guild.channels.cache.get(categoryid);
    //   bot.database.prepare("UPDATE guilddata SET ticketcategoryid=?,ticketsystemready=? WHERE guildid=?").run(categoryid, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setcategory.selected").join("\n")
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{PREFIX}/g, prefix).replace(/{INFO}/g, bot.emoji.info).replace(/{CHANNEL}/g, ticketCategory.name))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "mode" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   //tickettype 0 command | 1 reaction
    //   let type = args[1] ? args[1].toLowerCase() : args[1];
    //   if (!type || !["command", "reaction"].includes(type)) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmode.error").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{INFO}/g, bot.emoji.info)
    //         .replace(/{WARNING}/g, bot.emoji.warning).replace(/{PREFIX}/g, prefix))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   type = type === "command" ? 0 : 1
    //   bot.database.prepare("UPDATE guilddata SET tickettype=?,ticketsystemready=? WHERE guildid=?").run(type, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmode.selected").join("\n").replace(/{PREFIX}/g, prefix).replace(/{WARNING}/g, bot.emoji.warning)
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{PREFIX}/g, prefix).replace(/{INFO}/g, bot.emoji.info).replace(/{MODE}/g, type === 0 ? "Command" : "Reaction"))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "reactionmessage" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   //ticketmessageid
    //   let ticketmessageid = args[1];
    //   let ticketmessage;
    //   if (ticketmessageid) {
    //     if (message.channel.messages.cache.has(ticketmessageid)) {
    //       ticketmessage = message.channel.messages.cache.get(ticketmessageid);
    //     } else {
    //       try {
    //         ticketmessage = await message.channel.messages.fetch(ticketmessageid)
    //       } catch (e) { }
    //     }
    //   }
    //   if (!ticketmessage) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmessageid.error").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{WARNING}/g, bot.emoji.warning).replace(/{INFO}/g, bot.emoji.info))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   try {
    //     await ticketmessage.react("🎟️")
    //   } catch (e) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmessageid.nopermission").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{CHECK}/g, bot.emoji.check)
    //         .replace(/{WARNING}/g, bot.emoji.warning).replace(/{INFO}/g, bot.emoji.info).replace(/{MESSAGELINK}/g, ticketmessage.url))
    //     return message.channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   bot.database.prepare("UPDATE guilddata SET ticketmessageid=?,ticketmessagechannelid=?,ticketsystemready=? WHERE guildid=?").run(ticketmessage.id, ticketmessage.channel.id, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmessageid.selected").join("\n").replace(/{CROSS}/g, bot.emoji.cross).replace(/{CHECK}/g, bot.emoji.check)
    //       .replace(/{WARNING}/g, bot.emoji.warning).replace(/{PREFIX}/g, prefix).replace(/{INFO}/g, bot.emoji.info).replace(/{MESSAGELINK}/g, ticketmessage.url))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "newmessage" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   //ticketmessage
    //   if (!args[1]) {
    //     let error = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmessage.error").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //         .replace(/{WARNING}/g, bot.emoji.warning).replace(/{INFO}/g, bot.emoji.info))
    //     return message.channel.send(error).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   let n = message.content.toLowerCase().indexOf("newmessage");
    //   let finalmessage = message.content.slice(n + 10)
    //   let supportRole = message.guild.roles.cache.has(guildData.supportroleid) ? message.guild.roles.cache.get(guildData.supportroleid) : "`No Support Role`"
    //   let exampleMessage = finalmessage.replace(/{EVERYONE}/gi, "@everyone").replace(/{HERE}/gi, "@here").replace(/{SUPPORTROLE}/gi, supportRole).replace(/{USER}/gi, message.author)
    //   bot.database.prepare("UPDATE guilddata SET ticketmessage=?,ticketsystemready=? WHERE guildid=?").run(finalmessage, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setmessage.selected").join("\n").replace(/{MESSAGE}/g, exampleMessage)
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{INFO}/g, bot.emoji.info).replace(/{PREFIX}/g, prefix).replace(/{VERIFIED}/g, bot.emoji.verified).replace(/{WARNING}/g, bot.emoji.warning))
    //   return message.channel.send(selected).then(m => m.delete({ timeout: 15000 }).catch(console.error)).catch(console.error)
    // } else if (subcommand === "supportrole" && message.member.hasPermission("ADMINISTRATOR")) {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let supportroleid = args[1];
    //   if (!supportroleid || !message.guild.roles.cache.has(supportroleid)) {
    //     let selected = new MessageEmbed()
    //       .setColor(bot.colors.red)
    //       .setDescription(bot.utils.getTranslation(bot, language, "ticket.setsupportrole.error").join("\n")
    //         .replace(/{CROSS}/g, bot.emoji.cross).replace(/{INFO}/g, bot.emoji.info).replace(/{PREFIX}/g, prefix))
    //     return message.channel.send(selected).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    //   }
    //   bot.ticketreactionmap.delete(message.channel.id)
    //   let supportrole = message.guild.roles.cache.get(supportroleid);
    //   bot.database.prepare("UPDATE guilddata SET supportroleid=?,ticketsystemready=? WHERE guildid=?").run(supportrole.id, 0, message.guild.id);
    //   let selected = new MessageEmbed()
    //     .setColor(bot.colors.green)
    //     .setDescription(bot.utils.getTranslation(bot, language, "ticket.setsupportrole.selected").join("\n")
    //       .replace(/{CHECK}/g, bot.emoji.check).replace(/{INFO}/g, bot.emoji.info).replace(/{SUPPORTROLE}/g, `${supportrole}`))
    //   return message.channel.send(selected).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    // } else {
    //   message.delete({ timeout: 500 }).catch(console.error)
    //   let help = new MessageEmbed()
    //     .setAuthor(bot.utils.getTranslation(bot, language, "ticket.help.title").replace(/{BOTNAME}/g, bot.user.username))
    //     .setThumbnail(bot.user.displayAvatarURL())
    //     .setDescription(bot.utils.getTranslation(bot, language, `ticket.help.${message.member.hasPermission("ADMINISTRATOR") ? "administrator" : "user"}.description`).join("\n")
    //       .replace(/{TICKETNEW}/g, type === 0 ? bot.utils.getTranslation(bot, language, "ticket.help.ticketnew") : "")
    //       .replace(/{PREFIX}/g, prefix).replace(/{WARNING}/g, bot.emoji.warning)
    //       .replace(/{GITHUBLINK}/g, bot.config.github.main).replace(/{INVITE}/g, bot.invite))
    //     .setColor(bot.colors.gold)
    //   return message.channel.send(help).catch(console.error).then(m => m.delete({ timeout: 15000 }).catch(console.error))
    // }
  }
}  