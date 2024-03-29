const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["h", "ayuda", "?"],
  category: "INFORMATION",
  description: "Magic8 Commands Help Menu - Type a command to get extra information about it",
  emoji: "❔",
  name: "help",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    if (!bot.helpmenus.has(message.guild.id)) bot.helpmenus.set(message.guild.id, bot.helpEmbed);
    if (!bot.adminmenus.has(message.guild.id)) bot.adminmenus.set(message.guild.id, bot.staffEmbed);
    if (args[0]) {
      let inputarray = [];
      for (let c of bot.commands.array()) {
        if (!c.dev) {
          inputarray.push(c.name);
        }
      }
      if (inputarray.includes(args[0].toLowerCase())) {
        let cmd = bot.commands.get(args[0].toLowerCase());
        let finalaliases;
        if (cmd.aliases.length > 0) {
          finalaliases = cmd.aliases.map(a => `\`${a}\``).join(", ");
        } else {
          finalaliases = bot.translate(bot, language, "none");
        }
        if (!cmd.toggleable) {
          toggleable = bot.translate(bot, language, "false");
        } else {
          toggleable = bot.translate(bot, language, "true");
        }
        if (cmd.premium) {
          premium = `\n**Premium:** ${bot.emoji.check}`;
        } else {
          premium = ``;
        }
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "help.commandinfotitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "help.commandinfo").join("\n")
            .replace(/{COMMANDNAME}/g, cmd.name)
            .replace(/{URL}/g, `https://docs.magic8.xyz/commands/${cmd.category.toLowerCase()}#:~:text=${cmd.name}`)
            .replace(/{ALIASES}/g, finalaliases)
            .replace(/{CATEGORY}/g, cmd.category.toLowerCase())
            .replace(/{ISDISABLED}/g, bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).includes(cmd.name) ? bot.translate(bot, language, "true") : bot.translate(bot, language, "false"))
            .replace(/{TOGGLEABLE}/g, toggleable)
            .replace(/{PREMIUM}/g, premium)
            .replace(/{DESCRIPTION}/g, cmd.description));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "help.invalidcommand").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[0])
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    if (!bot.helpmenus.get(message.guild.id)) {
      let tips = bot.translate(bot, language, "help.tips").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{GUIDE}/g, bot.docs.main)
        .replace(/{INVITE}/g, bot.invite)
        .replace(/{PREFIX}/g, prefix);
      let funarray = [];
      let infoarray = [];
      let gamesarray = [];
      let userarray = [];
      let utilsarray = [];
      let miscellaneousarray = [];
      let reactionarray = [];
      let minecraftarray = [];
      for (let c of bot.commands.array()) {
        if (!c.dev && c.category !== "ADMINISTRATOR") {
          let d = bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).includes(c.name) ? "!" : "";
          let category = c.category || "OTHERS";
          if (category === "ENTERTAINMENT") {
            funarray.push(`\`${d}${c.name}\``);
          } else if (category === "MINIGAMES") {
            gamesarray.push(`\`${d}${c.name}\``);
          } else if (category === "MINECRAFT") {
            minecraftarray.push(`\`${d}${c.name}\``);
          } else if (category === "REACTIONS") {
            reactionarray.push(`\`${d}${c.name}\``);
          } else if (category === "MISCELLANEOUS") {
            miscellaneousarray.push(`\`${d}${c.name}\``);
          } else if (category === "INFORMATION") {
            infoarray.push(`\`${d}${c.name}\``);
          } else if (category === "USER") {
            userarray.push(`\`${d}${c.name}\``);
          } else if (category === "UTILITIES") {
            utilsarray.push(`\`${d}${c.name}\``);
          }
        }
      }
      let disabledwarningmessage = bot.translate(bot, language, "help.hasdisabledcommands").replace(/{WARNING}/g, bot.emoji.warning).replace(/{GUILDNAME}/g, message.guild.name);
      let disabledwarning = bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).length > 0 ? disabledwarningmessage : "";
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "help.helpmenutitle").replace(/{GUILDNAME}/g, message.guild.name))
        .setColor(bot.colors.main)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(tips)
        .addField(`🎉 ${bot.translate(bot, language, "help.category.entertainment")}`, funarray.join(" "), false)
        .addField(`🕹️ ${bot.translate(bot, language, "help.category.minigames")}`, gamesarray.join(" "), false)
        .addField(`${bot.emoji.minecraft} ${bot.translate(bot, language, "help.category.minecraft")}`, minecraftarray.join(" "), false)
        .addField(`😍 ${bot.translate(bot, language, "help.category.reactions")}`, reactionarray.join(" "), false)
        .addField(`🎀 ${bot.translate(bot, language, "help.category.miscellaneous")}`, miscellaneousarray.join(" "), false)
        .addField(`📚 ${bot.translate(bot, language, "help.category.information")}`, infoarray.join(" "), false)
        .addField(`👤 ${bot.translate(bot, language, "help.category.user")}`, userarray.join(" "), false)
        .addField(`⚙️ ${bot.translate(bot, language, "help.category.utilities")}`, utilsarray.join(" "), false)
        .addField(`\u200b`, bot.translate(bot, language, "help.bottom")
          .replace(/{INVITE}/g, bot.invite)
          .replace(/{HASDISABLED}/g, disabledwarning), false);
      bot.helpmenus.set(message.guild.id, embed);
    }
    if (!bot.adminmenus.get(message.guild.id)) {
      let tips = bot.translate(bot, language, "help.tips").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{GUIDE}/g, bot.docs.main)
        .replace(/{INVITE}/g, bot.invite)
        .replace(/{PREFIX}/g, prefix);
      let funarray = [];
      let infoarray = [];
      let gamesarray = [];
      let adminarray = [];
      let userarray = [];
      let utilsarray = [];
      let miscellaneousarray = [];
      let reactionarray = [];
      let minecraftarray = [];
      for (let c of bot.commands.array()) {
        if (!c.dev) {
          let d = bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).includes(c.name) ? "!" : "";
          let category = c.category || "OTHERS";
          if (category === "ENTERTAINMENT") {
            funarray.push(`\`${d}${c.name}\``);
          } else if (category === "MINIGAMES") {
            gamesarray.push(`\`${d}${c.name}\``);
          } else if (category === "MINECRAFT") {
            minecraftarray.push(`\`${d}${c.name}\``);
          } else if (category === "REACTIONS") {
            reactionarray.push(`\`${d}${c.name}\``);
          } else if (category === "MISCELLANEOUS") {
            miscellaneousarray.push(`\`${d}${c.name}\``);
          } else if (category === "INFORMATION") {
            infoarray.push(`\`${d}${c.name}\``);
          } else if (category === "USER") {
            userarray.push(`\`${d}${c.name}\``);
          } else if (category === "UTILITIES") {
            utilsarray.push(`\`${d}${c.name}\``);
          } else if (category === "ADMINISTRATOR") {
            adminarray.push(`\`${d}${c.name}\``);
          }
        }
      }
      let disabledwarningmessage = bot.translate(bot, language, "help.hasdisabledcommandsadmin").replace(/{WARNING}/g, bot.emoji.warning).replace(/{GUILDNAME}/g, message.guild.name).replace(/{PREFIX}/g, prefix);
      let disabledwarning = bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).length > 0 ? disabledwarningmessage : "";
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "help.administratormenutitle").replace(/{GUILDNAME}/g, message.guild.name))
        .setColor(bot.colors.main)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(tips)
        .addField(`🎉 ${bot.translate(bot, language, "help.category.entertainment")}`, funarray.join(" "), false)
        .addField(`🕹️ ${bot.translate(bot, language, "help.category.minigames")}`, gamesarray.join(" "), false)
        .addField(`${bot.emoji.minecraft} ${bot.translate(bot, language, "help.category.minecraft")}`, minecraftarray.join(" "), false)
        .addField(`😍 ${bot.translate(bot, language, "help.category.reactions")}`, reactionarray.join(" "), false)
        .addField(`🎀 ${bot.translate(bot, language, "help.category.miscellaneous")}`, miscellaneousarray.join(" "), false)
        .addField(`📚 ${bot.translate(bot, language, "help.category.information")}`, infoarray.join(" "), false)
        .addField(`👤 ${bot.translate(bot, language, "help.category.user")}`, userarray.join(" "), false)
        .addField(`⚙️ ${bot.translate(bot, language, "help.category.utilities")}`, utilsarray.join(" "), false)
        .addField(`👮 ${bot.translate(bot, language, "help.category.administrator")}`, adminarray.join(" "), false)
        .addField(`\u200b`, bot.translate(bot, language, "help.adminbottom").join("\n")
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INVITE}/g, bot.invite)
          .replace(/{HASDISABLED}/g, disabledwarning), false);
      bot.adminmenus.set(message.guild.id, embed);
    }
    let embed = new MessageEmbed()
    let embedToSend = message.member.hasPermission("MANAGE_GUILD") ? bot.adminmenus.get(message.guild.id) : bot.helpmenus.get(message.guild.id);
    return message.author.send(embedToSend).then(m => {
      embed.setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "help.sent").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{USER}/g, message.author)
          .replace(/{GUIDE}/g, bot.docs.main)
          .replace(/{INVITE}/g, bot.invite)
          .replace(/{MESSAGELINK}/g, m.url));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }).catch(e => {
      embed.setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "help.cannotsend").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author)
          .replace(/{GUIDE}/g, bot.docs.main)
          .replace(/{INVITE}/g, bot.invite));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    })
  }
}