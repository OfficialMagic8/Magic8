const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "raw",
  run: async (bot, raw) => {
    // if (["MESSAGE_DELETE_BULK", "MESSAGE_CREATE", "PRESENCE_UPDATE", "GUILD_MEMBER_UPDATE", "TYPING_START",
    //   "GUILD_MEMBERS_CHUNK", "VOICE_STATE_UPDATE", "MESSAGE_UPDATE", "CHANNEL_UPDATE", "MESSAGE_DELETE"].includes(raw.t)) return;
    // if (raw.t === "MESSAGE_REACTION_ADD") {
    //   //console.log(raw)
    //   let guild_id = raw.d.guild_id
    //   if (bot.ticketreactionmap.has(guild_id)) {
    //     let object = bot.ticketreactionmap.get(guild_id);
    //     // let emoji_id = raw.d.emoji.id
    //     // let emoji_animated = raw.d.emoji.animated?true:false;
    //     let message_id = raw.d.message_id
    //     if (object.message_id === message_id) {
    //       let channel_id = raw.d.channel_id
    //       if (object.channel_id === channel_id) {
    //         let emoji_name = raw.d.emoji.name
    //         if (emoji_name === "🎟️") {
    //           //if((emoji_id === null && object.emoji.name === emoji_name) || (emoji_id !== null && object.emoji.id === emoji_id)){ 
    //           let guild = bot.guilds.cache.get(guild_id);
    //           if (guild) {
    //             if (guild.channels.cache.has(channel_id)) {
    //               let channel = guild.channels.cache.get(channel_id);
    //               let member = undefined;
    //               let user_id = raw.d.user_id
    //               if (guild.members.cache.has(user_id)) {
    //                 member = guild.members.cache.get(user_id);
    //               } else {
    //                 try {
    //                   member = await guild.members.fetch(message_id, true);
    //                 } catch (e) { }
    //               }
    //               if (member) {
    //                 if (!member.user.bot) {
    //                   let message = undefined;
    //                   if (channel.messages.cache.has(message_id)) {
    //                     message = channel.messages.cache.get(message_id)
    //                   } else {
    //                     try {
    //                       message = await channel.messages.fetch(message_id);
    //                     } catch (e) { }
    //                   }
    //                   if (message) {
    //                     //let identifier = emoji_id === null?emoji_name:`${emoji_name}:${emoji_id}`
    //                     if (message.reactions.cache.has("🎟️")) message.reactions.cache.get("🎟️").users.remove(user_id).catch(e => { })
    //                     let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild_id)
    //                     let category = guild.channels.cache.get(guildData.ticketcategoryid);
    //                     let language = bot.utils.getLanguage(bot, guildData.language);
    //                     if (!category || category.type !== "category") {
    //                       let error = new MessageEmbed()
    //                         .setColor(bot.colors.red)
    //                         .setDescription(bot.translate(bot, language, "ticket.new.notsetup").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //                           .replace(/{INFO}/g, bot.emoji.info))
    //                       member.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { })).catch(e => { })
    //                     }
    //                     let ticketNameCheck = `ticket-${member.id}`;
    //                     let ticketmaxamount = guildData.ticketmaxamount;
    //                     let ticketsupportroleid = guildData.ticketsupportroleid;
    //                     let actualOpenedTickets = guild.channels.cache.filter(c => c.name.startsWith(ticketNameCheck));
    //                     let actualTicketsAmount = actualOpenedTickets.size;
    //                     let currentticket = 1
    //                     if (actualOpenedTickets.size >= 1) {
    //                       if (actualTicketsAmount >= guildData.ticketmaxamount) {
    //                         let error = new MessageEmbed()
    //                           .setColor(bot.colors.red)
    //                           .setDescription(bot.translate(bot, language, "ticket.new.maxtickets").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
    //                             .replace(/{AMOUNT}/g, ticketmaxamount).replace(/{INFO}/g, bot.emoji.info))
    //                         return member.send(error).catch(e => { })
    //                       }
    //                       let amounts = actualOpenedTickets.filter(c => {
    //                         let parts = c.name.split("-");
    //                         if (parts.length == 3) {
    //                           let index = parts[2];
    //                           return !isNaN(index);
    //                         } else {
    //                           return false;
    //                         }
    //                       }).map(Number);
    //                       let maxIndex = Math.max.apply(null, amounts)
    //                       currentticket = maxIndex + 1;
    //                     } else {
    //                       currentticket = 1;
    //                     }
    //                     bot.utils.attemptOpenTicket(bot, guild, member, category, language, guildData, currentticket, undefined);
    //                     //console.log(raw);
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
}