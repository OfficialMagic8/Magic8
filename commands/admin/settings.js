const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["s"],
  category: "ADMIN",
  description: "Advanced Server Settings - Requires `Manage Server` Permission",
  emoji: "⚙️",
  name: "settings",
  run: async (bot, message, args, prefix, guildData) => {
    let b = `${bot.user.username} -`
    let subcommand = args[0] ? args[0].toLowerCase() : args[0];
    let subcommand2 = args[1] ? args[1].toLowerCase() : args[1];
    if (subcommand === "toggle") {
      let disabledCommands = JSON.parse(guildData.disabledcommands)
      let max = bot.maxtoggledcommands.get(bot.premium.get(message.guild.id))
      let cmdToDisable = args[1] ? args[1].toLowerCase() : args[1];
      disabledCommands.sort()
      let disabledCommandsString = disabledCommands.length === 0 ? `*none*` : disabledCommands.map(c => `\`${c.trim()}\``).join(" ")
      if (disabledCommands.length >= max && !disabledCommands.includes(cmdToDisable)) {
        let upgradestring;
        if ([0, 1].includes(bot.premium.get(message.guild.id))) {
          upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to be able to toggle more commands.`;
        } else {
          upgradestring = `Anti-Ping users cannot be increased through packages anymore.`;
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Toggled Commands Limit Reached:** \`${max}\``,
            ``,
            upgradestring,
            ``,
            `**Disabled Commands:**`,
            `${disabledCommandsString}`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (!cmdToDisable) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Please provide a valid command to toggle.**`,
            ``,
            `${bot.emoji.info} To get a list of available commands, type: \`${prefix}help\``])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else {
        if (bot.commands.has(cmdToDisable)) {
          let commandToDisable = bot.commands.get(cmdToDisable);
          if (!commandToDisable.dev) {
            if (!commandToDisable.toggleable) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Command Not Toggleable:** \`${commandToDisable.name}\``,
                  ``,
                  `If you think this command should be toggleable please join our [Support Server](${bot.invite})`,
                  ``,
                  `**Disabled Commands:**`,
                  `${disabledCommandsString}`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            } else {
              if (disabledCommands.includes(commandToDisable.name)) {
                let finalDisabled = disabledCommands.filter(dc => dc !== commandToDisable.name)
                finalDisabled.sort();
                let disabledCommandsString
                if (finalDisabled.length <= 0) {
                  bot.disabledcommands.delete(message.guild.id)
                  disabledCommandsString = `*none*`
                } else {
                  disabledCommandsString = finalDisabled.map(c => `\`${c.trim()}\``).join(" ")
                }
                let commandsToSave = finalDisabled.length <= 0 ? [] : finalDisabled
                bot.disabledcommands.set(message.guild.id, commandsToSave)
                bot.db.prepare("UPDATE guilddata SET disabledcommands=? WHERE guildid=?").run(JSON.stringify(commandsToSave), message.guild.id)
                if (bot.helpmenus.has(message.guild.id)) bot.helpmenus.delete(message.guild.id)
                if (bot.adminmenus.has(message.guild.id)) bot.adminmenus.delete(message.guild.id)
                let embed = new MessageEmbed()
                  .setColor(bot.colors.green)
                  .setDescription([
                    `${bot.emoji.check} **Command Enabled:** \`${commandToDisable.name}\``,
                    ``,
                    `**Disabled Commands:**`,
                    `${disabledCommandsString}`])
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              } else {
                disabledCommands.push(commandToDisable.name);
                disabledCommands.sort();
                let disabledCommandsFormat = disabledCommands.map(dc => `\`${dc.trim()}\``)
                bot.disabledcommands.set(message.guild.id, disabledCommands)
                if (bot.helpmenus.has(message.guild.id)) bot.helpmenus.delete(message.guild.id)
                if (bot.adminmenus.has(message.guild.id)) bot.adminmenus.delete(message.guild.id)
                bot.db.prepare("UPDATE guilddata SET disabledcommands=? WHERE guildid=?").run(JSON.stringify(disabledCommands), message.guild.id)
                let embed = new MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription([
                    `${bot.emoji.cross} **Command Disabled:** \`${commandToDisable.name}\``,
                    ``,
                    `**Disabled Commands:**`,
                    `${disabledCommandsFormat.join(" ")}`])
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              }
            }
          }
        }
        let info = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Invalid Command Provided:** \`${cmdToDisable}\``,
            ``,
            `**Disabled commands:**`,
            `${disabledCommandsString}`,
            ``,
            `${bot.emoji.info} View all commands with \`${prefix}help\` or check if a command can be toggled with \`${prefix}help <command>\``])
        return message.channel.send(info).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "toggled") {
      let get = JSON.parse(guildData.disabledcommands)
      let disabled = get.map(c => `\`${c}\``).join(" ")
      if (get.length === 0) {
        bot.disabledcommands.delete(message.guild.id)
        disabled = `*none*`
      }
      let max = bot.maxtoggledcommands.get(bot.premium.get(message.guild.id))
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription([
          `**Disabled Commands: ${get.length}/${max}**`,
          ``,
          `${disabled}`,
          ``,
          `${bot.emoji.info} To disable or enable a command, type: \`${prefix}s toggle\``])
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    } else if (subcommand === "prefix") {
      if (!args[1] || args[1].length <= 0) {
        let error = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription([
            `${bot.emoji.info} **Current Prefix:** \`${prefix}\``,
            ``,
            `**To set prefix:** \`${prefix}s prefix <prefix>\``,
            ``,
            `${bot.emoji.warning} Make sure you don't use special characters like chinese or unicode emojis!`])
        return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
      }
      let newPrefix = args[1];
      bot.prefixes.set(message.guild.id, newPrefix)
      bot.db.prepare("UPDATE guilddata SET prefix=? WHERE guildid=?").run(newPrefix, message.guild.id)
      let success = new MessageEmbed()
        .setColor(bot.colors.main)
        .setDescription([
          `${bot.emoji.check} **You updated this server's prefix to \`${newPrefix}\`!**`,
          ``,
          `Magic8 will no longer reply with other previous prefixes! Tag Magic8 in chat if you forgot the prefix!`,
          ``,
          `${bot.emoji.verified} If you have problems with your prefix, join our [Support Server](${bot.invite}) and let us know!.`])
      return message.channel.send(success).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "8ball") {
      if (subcommand2 === "setreplies") {
        if (!args[2] || args.slice(2).join(" ").split("|").length < 2) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Please provide at least 2 replies separated by: \`|\`**`,
              ``,
              `**Example:** \`${prefix}s 8ball setreplies Reply 1 | Reply 2 ...\``,
              ``,
              `${bot.emoji.info} If you want to add new replies, you'll have to copy your old replies in addition to your new ones.`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let replies = args.slice(2).join(" ").split("|");
        let cleanReplies = replies.map(reply => reply.trim()).filter(reply => reply.length >= 1);
        if (cleanReplies < 2) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Please provide at least 2 replies separated by: \`|\`**`,
              ``,
              `**Example:** \`${prefix}s 8ball setreplies Reply 1 | Reply 2 ...\``,
              ``,
              `${bot.emoji.info} If you want to add new replies, you'll have to copy your old replies in addition to your new ones.`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let max = bot.maxballreplies.get(bot.premium.get(message.guild.id))
        let upgradestring;
        if ([0, 1].includes(bot.premium.get(message.guild.id))) {
          upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to restrict more channels.`
        } else {
          upgradestring = `Magic 8 Ball Custom Replies cannot be increased through packages anymore.`
        }
        if (cleanReplies.length > max) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Custom Replies Limit Reached:** \`${max}\``,
              ``,
              upgradestring]);
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.db.prepare("UPDATE guilddata SET ballcustomreplies=? WHERE guildid=?").run(cleanReplies, message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription([
            `${bot.emoji.check} **Successfully Saved ${cleanReplies.length}/${bot.maxballreplies.get(bot.premium.get(message.guild.id))} Custom Replies**`,
            ``,
            `To enable custom replies use \`${prefix}s 8ball mode custom\``,
            ``,
            `${bot.emoji.info} If you want to add new replies, you'll have to use the command with all **previous** replies again.`]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (subcommand2 === "replies") {
        let getreplies = JSON.parse(guildData.ballcustomreplies)
        if (getreplies.length <= 0) {
          let replies = new MessageEmbed()
            .setColor(bot.colors.main)
            .setDescription([
              `${bot.emoji.cross} **No Custom Replies**`,
              ``,
              `${bot.emoji.info} If you want to add new replies, use \`${prefix}s setreplies\` for more information.`])
          return message.channel.send(replies).catch(e => { return bot.error(bot, message, language, e); });
        }
        let finalReplies = `- ${getreplies.map(r => `**-** ${r}`).join("\n")}`
        let finalDoc = finalReplies + "\r\n\r\n**Preformatted Current Replies:**\r\n" + getreplies.join(" | ");
        if (finalReplies.length < 1750) {
          let replies = new MessageEmbed()
            .setColor(bot.colors.main)
            .setAuthor(`Magic 8 Ball - Custom Replies (${getreplies.length}/${bot.maxballreplies.get(bot.premium.get(message.guild.id))})`)
            .setDescription([
              `**Current Replies:**`,
              `${finalDoc}`,
              ``,
              `${bot.emoji.info} To enable custom replies use \`${prefix}s 8ball mode custom\`. If you want to add new replies, you'll have to copy your old replies in addition to your new ones.`])
          return message.channel.send(replies).catch(e => { return bot.error(bot, message, language, e); });
        } else {
          let replies = new MessageEmbed()
            .setColor(bot.colors.main)
            .setAuthor(`Magic 8 Ball - Custom Replies (${getreplies.length}/${bot.maxballreplies.get(bot.premium.get(message.guild.id))})`)
            .setDescription([
              `${bot.emoji.info} To enable custom replies use \`${prefix}s 8ball mode custom\`. If you want to add new replies, you'll have to copy your old replies in addition to your new ones.`])
          try {
            bot.fs.writeFileSync("././templates/customr8ballreplies.txt", finalDoc, 'utf8')
          } catch (e) {
            return bot.error(bot, message, language, e);
          }
          return message.channel.send("", {
            embed: replies,
            files: [{
              attachment: "././templates/customr8ballreplies.txt",
              name: `Custom_Replies.txt`
            }]
          }).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (subcommand2 === "mode") {
        if (!args[2]) {
          let error = new MessageEmbed()
            .setAuthor(`Magic 8 Ball - Mode Settings`)
            .setColor(bot.colors.main)
            .setDescription([
              `**Available Modes:**`,
              `\`all\`, \`clean\`, \`explicit\` or \`custom\``,
              ``,
              `${bot.emoji.info} Type the command again with a mode to update.`])
          return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
        }
        let mode = args[2].toLowerCase();
        if (!bot.repliestypes.has(mode)) {
          let error = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Invalid Mode Provided:** \`${mode}\``,
              ``,
              `**Available Modes:**`,
              `\`all\`, \`clean\`, \`explicit\` or \`custom\``,
              ``,
              `${bot.emoji.info} Type the command again with a mode to update.`])
          return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
        }
        let oldMode = bot.repliestypes.get(guildData.ballreplytype)
        let newMode = bot.repliestypes.get(mode);
        bot.db.prepare("UPDATE guilddata SET ballreplytype=? WHERE guildid=?").run(newMode, message.guild.id)
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription([
            `${bot.emoji.check} **Magic8 8 Ball Reply Mode Updated**`,
            ``,
            `**Old:** ${oldMode}`,
            `**New:** ${mode}`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else if (subcommand2 === "color") {
        if (!args[2]) {
          let error = new MessageEmbed()
            .setAuthor(`Magic 8 Ball - Color Settings`)
            .setColor(bot.colors.main)
            .setDescription([
              `**Valid Colors:** \`#ab309c\`, \`random\` or \`blue\``,
              ``,
              `**Current Color:** \`${guildData.ballcolor}\``,
              ``,
              `${bot.emoji.info} Invalid colors will default to black.`])
          return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
        }
        let newcolor = args[2].toUpperCase();
        bot.db.prepare("UPDATE guilddata SET ballcolor=? WHERE guildid=?").run(newcolor, message.guild.id)
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription([
            `${bot.emoji.check} **Magic 8 Ball Color Updated**`,
            ``,
            `**New Color:** \`${newcolor}\``,
            ``,
            `${bot.emoji.info} To check it out, type \`${prefix}8ball <question>\``])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else {
        let help = new MessageEmbed()
          .setAuthor(`${b} Magic 8 Ball Settings`)
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription([
            `\`${prefix}s 8ball color\` - Change Message Color`,
            `\`${prefix}s 8ball mode\` - Select Replies Mode`,
            `\`${prefix}s 8ball replies\` - List Custom Replies`,
            `\`${prefix}s 8ball setreplies\` - Set Custom Replies`,
            ``,
            `${bot.emoji.info} Use these commands for more information!`])
        return message.channel.send(help).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "media") {
      if (subcommand2 === "text") {
        if (guildData.mediatext === "none") {
          let media = args.slice(2).join(" ")
          if (!media) {
            let error = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Please type a message about your media!**`,
                ``,
                `*All types of emojis work (including custom emojis **in your server only**):* :tv: & \\📺 & ${bot.emoji.magic8}`,
                ``,
                `*Click [here](https://gist.github.com/Almeeida/41a664d8d5f3a8855591c2f1e0e07b19) for a **markdown** tutorial!*`,
                ``,
                `**__Example:__**`,
                `\`\`\``,
                `Subscribe to our **YouTube** channel at: __https://youtube.com/__`,
                `Follow our **Twitter** page @ __https://twitter.com/MyTwitter__`,
                `Check out our new website: __https://website.net/__`,
                `\`\`\``])
            return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
          } else if (media === "none") {
            bot.db.prepare("UPDATE guilddata SET mediatext=? WHERE guildid=?").run("none", message.guild.id)
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription([
                `${bot.emoji.check} **Server Media Removed**`,
                ``,
                `${bot.emoji.info} To add a media page in the future, type \`${prefix}s media text\``])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          } else {
            bot.db.prepare("UPDATE guilddata SET mediatext=? WHERE guildid=?").run(media, message.guild.id)
            bot.hastebin(`## Beautiful Preformatted Media by Magic8 <3\nJust copy the text below!\n\n${prefix}s media text ${guildData.mediatext}`, { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **Server Media Updated**`,
                  ``,
                  `To view your media, type \`${prefix}media\``,
                  ``,
                  `${bot.emoji.info} If you would like to make edits, here is a link of your text:`,
                  `**${haste}**`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); })
            }).catch(e => {
              console.error(e)
              let error = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Unexpected error occured when making a copy of your media!`,
                  ``,
                  `Your media still should have updated.`,
                  ``,
                  `*If you still receive this error when updating media, join our **[Support Server](${bot.invite})** for assistance.*`])
              return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
            });
          }
        }
        if (guildData.mediatext !== "none") {
          let media = args.slice(2).join(" ")
          if (media === "none") {
            bot.db.prepare("UPDATE guilddata SET mediatext=? WHERE guildid=?").run("none", message.guild.id)
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription([
                `${bot.emoji.check} **Server Media Removed**`,
                ``,
                `Non administrators will no longer be able to use the command!`,
                ``,
                `${bot.emoji.info} To add a media page in the future, type \`${prefix}s media text <text>\``].join("\n"))
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          } else if (!media) {
            bot.hastebin(`## Beautiful Preformatted Media by Magic8 <3\nJust copy the text below!\n\n${prefix}s media text ${guildData.mediatext}`, { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let error = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Update Server Media Text**`,
                  ``,
                  `${bot.emoji.info} Here is a text document of your current media text:`,
                  `**${haste}**`])
              return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
            }).catch(e => {
              console.error(e);
              let error = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Unexpected error occured when making a copy of your media!**`,
                  ``,
                  `Your media still should have updated.`,
                  ``,
                  `${bot.emoji.info} If you still receive this error when updating media, join our **[Support Server](${bot.invite})** for assistance.`])
              return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
            });
          } else {
            bot.db.prepare("UPDATE guilddata SET mediatext=? WHERE guildid=?").run(media, message.guild.id)
            bot.hastebin(`## Beautiful Preformatted Media by Magic8 <3\nJust copy the text below!\n\n${prefix}s media text ${guildData.mediatext}`, { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let complete = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **Server Media Text Updated**`,
                  ``,
                  `To view your media, type \`${prefix}media\``,
                  ``,
                  `${bot.emoji.info} If you would like to make edits, here is a link of your text:`,
                  `**${haste}**`])
              message.channel.send(complete).catch(e => { return bot.error(bot, message, language, e); });
            }).catch(e => {
              console.error(e)
              let error = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Unexpected error occured when making a copy of your media!`,
                  ``,
                  `Your media still should have updated.`,
                  ``,
                  `*If you still receive this error when updating media, join our **[Support Server](${bot.invite})** for assistance.*`])
              return message.channel.send(error).catch(e => { return bot.error(bot, message, language, e); });
            });
          }
        }
      } else if (subcommand2 === "image") {
        let url = args[2]
        if (url === "none") {
          bot.db.prepare("UPDATE guilddata SET mediaimage=? WHERE guildid=?").run("none", message.guild.id)
          let complete = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **Image URL Removed**`,
              `Your media page will no longer have an image below the description!`])
          message.channel.send(complete).catch(e => { return bot.error(bot, message, language, e); });
        } else if (!url || args[3]) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **Please provide an image URL and make sure it works!**`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        } else {
          bot.db.prepare("UPDATE guilddata SET mediaimage=? WHERE guildid=?").run(url, message.guild.id)
          let complete = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **Image URL Updated**`,
              ``,
              `**Link:** __${url}__`,
              ``,
              `To view your media, type \`${prefix}media\``].join("\n"))
          message.channel.send(complete).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (subcommand2 === "color") {
        if (!args[2]) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Server Media Color**`,
              ``,
              `**Valid Colors:** \`#ab309c\`, \`random\` or \`blue\``,
              ``,
              `**Current Color:** ${guildData.mediacolor}`,
              ``,
              `${bot.emoji.warning} If the color provided is invalid. The embed color will be black.`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        let newcolor = args[2].toUpperCase();
        bot.db.prepare("UPDATE guilddata SET mediacolor=? WHERE guildid=?").run(newcolor, message.guild.id)
        let embed = new MessageEmbed()
          .setDescription([
            `${bot.emoji.check} **Server Media Color Updated**`,
            ``,
            `**New Color:** \`${newcolor}\``,
            ``,
            `${bot.emoji.info} To change the color, type \`${prefix}s media color\``].join("\n"))
          .setColor(bot.colors.green)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else {
        let embed = new MessageEmbed()
          .setAuthor(`${b} Server Media Settings`)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setColor(bot.colors.main)
          .setDescription([
            `\`${prefix}s media color\` - Set Media Color`,
            `\`${prefix}s media image\` - Set Image Below Text`,
            `\`${prefix}s media text\` - Set Media Text Content`,
            ``,
            `${bot.emoji.info} Use these commands for more information!`].join("\n"))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    } else if (subcommand === "funchannel") {
      if (args[1] && args[1].toLowerCase() === "clear") {
        let channels = JSON.parse(guildData.funchannel);
        if (channels.length === 0) {
          let embed = new MessageEmbed()
            .setDescription([`${bot.emoji.cross} **There are already no channels for \`Fun\` commands.**`])
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.funchannels.delete(message.guild.id);
        bot.db.prepare("UPDATE guilddata SET funchannel=? WHERE guildid=?").run("[]", message.guild.id)
        let embed = new MessageEmbed()
          .setDescription([`${bot.emoji.check} **You have cleared all channels for \`Fun\` commands!**`])
          .setColor(bot.colors.green)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (args[1] && args[1].toLowerCase() === "add") {
        let max = bot.maxrestrictedchannels.get(bot.premium.get(message.guild.id));
        let channels = JSON.parse(guildData.funchannel);
        if (channels.length >= max) {
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
          })
          let upgradestring;
          if ([0, 1].includes(bot.premium.get(message.guild.id))) {
            upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to restrict more channels.`
          } else {
            upgradestring = `Fun Restricted Channels cannot be increased through packages anymore.`;
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Fun Restricted Channels Limit Reached:** \`${max}\``,
              ``,
              upgradestring,
              ``,
              `**Current Channels:**`,
              `${channelarray.join("\n")}`]);
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        if (guildData.funchannel.includes(message.channel.id)) {
          let alreadysaved = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is already saved for \`Fun\` commands!**`])
          return message.channel.send(alreadysaved).catch(e => { return bot.error(bot, message, language, e); });
        } else if (!guildData.funchannel.includes(message.channel.id)) {
          let channels = JSON.parse(guildData.funchannel);
          channels.push(message.channel.id);
          bot.funchannels.set(message.guild.id, channels);
          bot.db.prepare("UPDATE guilddata SET funchannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id);
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(c)}`);
          });
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Fun\` commands are now accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`,
              ``,
              `${bot.emoji.info} To unrestrict \`Fun\` commands, type: \`${prefix}s funchannel remove/clear\``])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (args[1] && args[1].toLowerCase() === "remove") {
        let channels = JSON.parse(guildData.funchannel)
        if (!channels.includes(message.channel.id)) {
          let notsaved = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is not saved for \`Fun\` commands.**`])
          return message.channel.send(notsaved).catch(e => { return bot.error(bot, message, language, e); });
        } else if (channels.includes(message.channel.id)) {
          let selectedchannel = channels.find(c => c === message.channel.id)
          channels.splice(channels.indexOf(selectedchannel), 1)
          bot.db.prepare("UPDATE guilddata SET funchannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = []
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c))
          });
          bot.funchannels.set(message.guild.id, bot.funchannels.get(message.guild.id).filter(c => c !== message.channel.id))
          if (channels.length === 0) {
            channelarray = ["*Open to all channels*"]
            bot.funchannels.delete(message.guild.id)
          }
          let embed = new MessageEmbed()
            .setDescription([
              `${bot.emoji.check} **\`Fun\` commands are no longer accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`])
            .setColor(bot.colors.green)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else {
        let channels = JSON.parse(guildData.funchannel)
        let channelarray = []
        channels.forEach(c => {
          channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c))
        })
        if (channels.length === 0) {
          channelarray = ["*Open to all channels*"]
        }
        let embed = new MessageEmbed()
          .setAuthor(`${b} Fun Commands - Channel Settings`)
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription([
            `${bot.emoji.info} No channel means no restrictions. At least one channel enables restriction to the added channels.`,
            ``,
            `\`${prefix}s funchannel add\``,
            `\`${prefix}s funchannel remove\``,
            `\`${prefix}s funchannel clear\``,
            ``,
            `**Channel List:**`,
            `${channelarray.join("\n")}`].join("\n"))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "minigamechannel") {
      if (args[1] && args[1].toLowerCase() === "clear") {
        let channels = JSON.parse(guildData.minigamechannel)
        if (channels.length === 0) {
          let embed = new MessageEmbed()
            .setDescription([`${bot.emoji.cross} **There are already no channels for \`Minigames\`.**`])
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.minigamechannels.delete(message.guild.id)
        bot.db.prepare("UPDATE guilddata SET minigamechannel=? WHERE guildid=?").run("[]", message.guild.id)
        let embed = new MessageEmbed()
          .setDescription([`${bot.emoji.check} **You have cleared all channels for \`Minigames\`!**`])
          .setColor(bot.colors.green)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (args[1] && args[1].toLowerCase() === "add") {
        let max = bot.maxrestrictedchannels.get(bot.premium.get(message.guild.id));
        let channels = JSON.parse(guildData.minigamechannel);
        if (channels.length >= max) {
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
          })
          let upgradestring;
          if ([0, 1].includes(bot.premium.get(message.guild.id))) {
            upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to restrict more channels.`
          } else {
            upgradestring = `Minigame Restricted Channels cannot be increased through packages anymore.`;
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Minigame Restricted Channels Limit Reached:** \`${max}\``,
              ``,
              upgradestring,
              ``,
              `**Current Channels:**`,
              `${channelarray.join("\n")}`]);
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        if (guildData.minigamechannel.includes(message.channel.id)) {
          let alreadysaved = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is already saved for \`Minigames\`!**`].join("\n"))
          return message.channel.send(alreadysaved).catch(e => { return bot.error(bot, message, language, e); });
        } else if (!guildData.minigamechannel.includes(message.channel.id)) {
          let channels = JSON.parse(guildData.minigamechannel);
          channels.push(message.channel.id);
          bot.db.prepare("UPDATE guilddata SET minigamechannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(c)}`)
          })
          let template = []
          if (bot.minigamechannels.has(message.guild.id)) {
            template = bot.minigamechannels.get(message.guild.id)
          }
          template.push(message.channel.id);
          bot.minigamechannels.set(message.guild.id, template);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Minigames\` are now accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`,
              ``,
              `${bot.emoji.info} To unrestrict \`Minigames\`, type: \`${prefix}s funchannel remove/clear\``])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (args[1] && args[1].toLowerCase() === "remove") {
        let channels = JSON.parse(guildData.minigamechannel)
        if (!channels.includes(message.channel.id)) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is not saved for \`Minigames\`.**`].join("\n"))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else if (channels.includes(message.channel.id)) {
          let selectedchannel = channels.find(c => c === message.channel.id)
          channels.splice(channels.indexOf(selectedchannel), 1)
          bot.db.prepare("UPDATE guilddata SET minigamechannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = []
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c))
          })
          bot.minigamechannels.set(message.guild.id, bot.minigamechannels.get(message.guild.id).filter(c => c !== message.channel.id))
          if (channels.length === 0) {
            channelarray = ["*Open to all channels*"]
            bot.minigamechannels.delete(message.guild.id)
          }
          let embed = new MessageEmbed()
            .setDescription([
              `${bot.emoji.check} **\`Minigames\` are no longer accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`])
            .setColor(bot.colors.green)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else {
        let channels = JSON.parse(guildData.minigamechannel);
        let channelarray = [];
        channels.forEach(c => {
          channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
        });
        if (channels.length === 0) {
          channelarray = ["*Open to all channels*"]
        }
        let embed = new MessageEmbed()
          .setAuthor(`${b} Minigames - Channel Settings`)
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription([
            `${bot.emoji.info} No channel means no restrictions. At least one channel enables restriction to the added channels.`,
            ``,
            `\`${prefix}s minigamechannel add\``,
            `\`${prefix}s minigamechannel remove\``,
            `\`${prefix}s minigamechannel clear\``,
            ``,
            `**Channel List:**`,
            `${channelarray.join("\n")}`]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "miscellaneouschannel") {
      if (args[1] && args[1].toLowerCase() === "clear") {
        let channels = JSON.parse(guildData.miscellaneouschannel)
        if (channels.length === 0) {
          let embed = new MessageEmbed()
            .setDescription([`${bot.emoji.cross} **There are already no channels for \`Miscellaneous\` commands.**`])
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.miscellaneouschannels.delete(message.guild.id)
        bot.db.prepare("UPDATE guilddata SET miscellaneouschannel=? WHERE guildid=?").run("[]", message.guild.id)
        let embed = new MessageEmbed()
          .setDescription([`${bot.emoji.check} **You have cleared all channels for \`Miscellaneous\` commands!**`])
          .setColor(bot.colors.green)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (args[1] && args[1].toLowerCase() === "add") {
        let max = bot.maxrestrictedchannels.get(bot.premium.get(message.guild.id))
        let channels = JSON.parse(guildData.miscellaneouschannel);
        if (channels.length >= max) {
          let channelarray = []
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
          });
          let upgradestring;
          if ([0, 1].includes(bot.premium.get(message.guild.id))) {
            upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to restrict more channels.`
          } else {
            upgradestring = `Miscellaneous Restricted Channels cannot be increased through packages anymore.`
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Miscellaneous Restricted Channels Limit Reached:** \`${max}\``,
              ``,
              upgradestring,
              ``,
              `**Current Channels:**`,
              `${channelarray.join("\n")}`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        if (guildData.miscellaneouschannel.includes(message.channel.id)) {
          let alreadysaved = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is already saved for \`Miscellaneous\` commands!**`].join("\n"))
          return message.channel.send(alreadysaved).catch(e => { return bot.error(bot, message, language, e); });
        } else if (!guildData.miscellaneouschannel.includes(message.channel.id)) {
          let channels = JSON.parse(guildData.miscellaneouschannel)
          let x = message.channel.id
          channels.push(x)
          bot.db.prepare("UPDATE guilddata SET miscellaneouschannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(c)}`)
          })
          let template = []
          if (bot.miscellaneouschannels.has(message.guild.id)) {
            template = bot.miscellaneouschannels.get(message.guild.id)
          }
          template.push(message.channel.id)
          bot.miscellaneouschannels.set(message.guild.id, template)
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Miscellaneous\` commands are now accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`,
              ``,
              `${bot.emoji.info} To unrestrict \`Miscellaneous\` commands, type: \`${prefix}s miscellaneouschannel remove/clear\``])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (args[1] && args[1].toLowerCase() === "remove") {
        let channels = JSON.parse(guildData.miscellaneouschannel)
        if (channels.includes(message.channel.id)) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is not saved for \`Miscellaneous\` commands.**`].join("\n"))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else if (channels.includes(message.channel.id)) {
          let selectedchannel = channels.find(c => c === message.channel.id);
          channels.splice(channels.indexOf(selectedchannel), 1)
          bot.db.prepare("UPDATE guilddata SET miscellaneouschannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
          })
          bot.miscellaneouschannels.set(message.guild.id, bot.miscellaneouschannels.get(message.guild.id).filter(c => c !== message.channel.id))
          if (channels.length === 0) {
            channelarray = ["*Open to all channels*"]
            bot.miscellaneouschannels.delete(message.guild.id);
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Miscellaneous\` commands are no longer accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else {
        let channels = JSON.parse(guildData.miscellaneouschannel)
        let channelarray = []
        channels.forEach(c => {
          channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
        })
        if (channels.length === 0) {
          channelarray = ["*Open to all channels*"]
        }
        let embed = new MessageEmbed()
          .setAuthor(`${b} Miscellaneous Commands - Channel Settings`)
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription([
            `${bot.emoji.info} No channel means no restrictions. At least one channel enables restriction to the added channels.`,
            ``,
            `\`${prefix}s miscellaneouschannel add\``,
            `\`${prefix}s miscellaneouschannel remove\``,
            `\`${prefix}s miscellaneouschannel clear\``,
            ``,
            `**Channel List:**`,
            `${channelarray.join("\n")}`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "reactionchannel") {
      if (args[1] && args[1].toLowerCase() === "clear") {
        let channels = JSON.parse(guildData.reactionchannel)
        if (channels.length === 0) {
          let embed = new MessageEmbed()
            .setDescription([`${bot.emoji.cross} **There are already no channels for \`Reaction\` commands.**`])
            .setColor(bot.colors.red)
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        bot.reactionchannels.set(message.guild.id)
        bot.db.prepare("UPDATE guilddata SET reactionchannel=? WHERE guildid=?").run("[]", message.guild.id)
        let embed = new MessageEmbed()
          .setDescription([`${bot.emoji.check} **You have cleared all channels for \`Reaction\` commands!**`])
          .setColor(bot.colors.green)
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (args[1] && args[1].toLowerCase() === "add") {
        let max = bot.maxrestrictedchannels.get(bot.premium.get(message.guild.id))
        let channels = JSON.parse(guildData.reactionchannel)
        if (channels.length >= max) {
          let channelarray = []
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c));
          })
          let upgradestring;
          if ([0, 1].includes(bot.premium.get(message.guild.id))) {
            upgradestring = `Please upgrade to the [${bot.premium.get(message.guild.id) === 1 ? `**Triple Package**` : `**Single or Triple Package**`}](${bot.config.donatelink}) to restrict more channels.`
          } else {
            upgradestring = `Reaction Restricted Channels cannot be increased through packages anymore.`
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([
              `${bot.emoji.cross} **Reaction Restricted Channels Limit Reached:** \`${max}\``,
              ``,
              upgradestring,
              ``,
              `**Current Channels:**`,
              `${channelarray.join("\n")}`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        if (guildData.reactionchannel.includes(message.channel.id)) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is already saved for \`Reaction\` commands.**`].join("\n"))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else if (!guildData.reactionchannel.includes(message.channel.id)) {
          let channels = JSON.parse(guildData.reactionchannel)
          channels.push(message.guild.id)
          bot.db.prepare("UPDATE guilddata SET reactionchannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = [];
          channels.forEach(c => {
            channelarray.push(`${bot.guilds.cache.get(message.guild.id).channels.cache.get(c)}`)
          })
          let template = []
          if (bot.reactionchannels.has(message.guild.id)) {
            template = bot.reactionchannels.get(message.guild.id)
          }
          template.push(message.channel.id)
          bot.reactionchannels.set(message.guild.id, template)
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Reaction\` commands are now accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`,
              ``,
              `${bot.emoji.info} To unrestrict \`Reaction\` commands, type: \`${prefix}s reactionchannel remove/clear\``])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else if (args[1] && args[1].toLowerCase() === "remove") {
        let embed = JSON.parse(guildData.reactionchannel)
        if (!channels.includes(message.channel.id)) {
          let notsaved = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **This channel is not saved for \`Reaction\` commands!**`].join("\n"))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else if (channels.includes(message.channel.id)) {
          let selectedchannel = channels.find(c => c === message.channel.id)
          channels.splice(channels.indexOf(selectedchannel), 1)
          bot.db.prepare("UPDATE guilddata SET reactionchannel=? WHERE guildid=?").run(JSON.stringify(channels), message.guild.id)
          let channelarray = []
          channels.forEach(c => {
            channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c))
          })
          bot.reactionchannels.set(message.guild.id, bot.reactionchannels.get(message.guild.id).filter(c => c !== message.channel.id))
          if (channels.length === 0) {
            channelarray = ["*Open to all channels*"]
            bot.reactionchannels.delete(message.guild.id)
          }
          if (bot.reactionchannels.has(message.guild.id)) {
            let template = []
            template = bot.reactionchannels.get(message.guild.id)
            template.splice(template.indexOf(message.channel.id), 1)
            bot.reactionchannels.set(message.guild.id, template)
          }
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **\`Reaction\` commands are no longer accessible through ${message.channel}**`,
              ``,
              `**Channel List:**`,
              `${channelarray.join("\n")}`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else {
        let channels = JSON.parse(guildData.reactionchannel)
        let channelarray = []
        channels.forEach(c => {
          channelarray.push(bot.guilds.cache.get(message.guild.id).channels.cache.get(c))
        })
        if (channels.length === 0) {
          channelarray = ["*Open to all channels*"]
        }
        let embed = new MessageEmbed()
          .setAuthor(`${b} Reaction Commands - Channel Settings`)
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription([
            `${bot.emoji.info} No channel means no restrictions. At least one channel enables restriction to the added channels.`,
            ``,
            `\`${prefix}s reactionchannel add\``,
            `\`${prefix}s reactionchannel remove\``,
            `\`${prefix}s reactionchannel clear\``,
            ``,
            `**Channel List:**`,
            `${channelarray.join("\n")}`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    } else if (subcommand === "lfg") {
      if ([1, 2].includes(bot.premium.get(message.guild.id))) {
        if (subcommand2 === "notifychannel") {
          if (args[2] && args[2].toLowerCase() === "remove") {
            if (guildData.lfgnotifychannel === "none") {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **LFG Notify Channel Already Not Set**`,
                  ``,
                  `${bot.emoji.info} To set the LFG Notify Channel, type: \`${prefix}s lfg notifychannel\``])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            } else {
              bot.lfgnotifychannels.delete(message.guild.id)
              bot.db.prepare("UPDATE guilddata SET lfgnotifychannel=? WHERE guildid=?").run("none", message.guild.id);
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **LFG Notify Channel Removed**`,
                  ``,
                  `${bot.emoji.info} To set a new LFG Notify Channel, type: \`${prefix}s lfg notifychannel\``])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }
          }
          bot.lfgnotifychannels.set(message.guild.id, message.channel.id)
          bot.db.prepare("UPDATE guilddata SET lfgnotifychannel=? WHERE guildid=?").run(message.channel.id, message.guild.id);
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **LFG Notify Channel Set**`,
              ``,
              `**Channel:** ${message.channel} (${message.channel.id})`,
              ``,
              `${bot.emoji.info} To remove the LFG Notify Channel, type: \`${prefix}s lfg notifychannel remove\``])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        } else if (subcommand2 === "role") {
          if (!args[2]) {
            let role = bot.guilds.cache.get(message.guild.id).roles.cache.get(guildData.lfgrole)
            if (!role) role = "none"
            let embed = new MessageEmbed()
              .setColor(bot.colors.main)
              .setAuthor(`${b} Looking For Group Role`)
              .setDescription([
                `**Role:** ${role}`,
                ``,
                `${bot.emoji.info} To disable LFG role, type: \`${prefix}s lfg role clear\``])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
          if (args[2].toLowerCase() === "clear") {
            if (guildData.lfgrole === "none") {
              let embed = new MessageEmbed()
                .setColor(bot.colord.red)
                .setDescription([
                  `${bot.emoji.cross} **There is already no LFG role.**`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            } else {
              bot.lfgroles.delete(message.guild.id)
              bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run("none", message.guild.id);
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **LFG Role Removed**`,
                  ``,
                  `${bot.emoji.info} To set the LFG role in the future, type: \`${prefix}s lfg role\``])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }
          }
          let targetrole;
          try {
            let id = args[2].replace(/[^0-9]/g, "");
            targetrole = message.guild.roles.cache.get(id) || await message.guild.roles.fetch(id)
          } catch (e) {
            let rolesarray = []
            let getroles = message.guild.roles.cache.keyArray()
            getroles.forEach(role => {
              rolesarray.push(`${message.guild.roles.cache.get(role)} (${role})`)
            })
            if (getroles.length === 0) {
              rolesarray = ["*none*"]
            }
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Invalid Role Provided:** \`${args[1]}\``,
                ``,
                `**Available Roles:**`,
                `${rolesarray.join("\n")}`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }
          bot.db.prepare("UPDATE guilddata SET lfgrole=? WHERE guildid=?").run(targetrole.id, message.guild.id);
          bot.lfgroles.set(message.guild.id, targetrole.id)
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription([
              `${bot.emoji.check} **LFG Role Set**`,
              ``,
              `**Role:** ${targetrole}`,
              ``,
              `${bot.emoji.info} This role will be automatically removed from users who give it to themselves after **2 hours**.`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        } else if (subcommand2 === "notifymessage") {
          let notifymessage = args.slice(2).join(" ")
          if (!notifymessage) {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Please provide a notify message.**`,
                ``,
                `**Current Notification:** \`${guildData.lfgnotifymessage}\``,
                ``,
                `${bot.emoji.info} Placeholders: {USER} - Mentions the user that no longer has LFG Role, {LFG} - Mentions LFG role.`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          } else {
            bot.db.prepare("UPDATE guilddata SET lfgnotifymessage=? WHERE guildid=?").run(notifymessage, message.guild.id);
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription([
                `${bot.emoji.check} **LFG Notify Message Set**`,
                ``,
                `**Message:** ${notifymessage}`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }
        } else if (subcommand2 === "time") {
          if (bot.premium.get(message.guild.id) === 2) {
            if (!args[2] || !["2", "3", "4", "5"].includes(args[2])) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Please provide a number between \`2\` and \`5\`**`,
                  ``,
                  `**Current Cooldown:** ${guildData.lfgcooldown}`,
                  ``,
                  `${bot.emoji.info} The number you select is the number of hours until LFG is removed from a user.`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }
            bot.db.prepare("UPDATE guilddata SET lfgcooldown=? WHERE guildid=?").run(parseInt(args[2]), message.guild.id);
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription([
                `${bot.emoji.check} **LFG Cooldown Updated**`,
                ``,
                `**New Cooldown:** ${parseInt(args[2])} hours`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          } else {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **You cannot set the cooldown with the package you currently have.**`,
                ``,
                `Please upgrade to the [**Triple Package**](${bot.config.donatelink}) to toggle all commands.`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }
        } else {
          let embed = new MessageEmbed()
            .setAuthor(`${b} Looking For Group Settings`)
            .setColor(bot.colors.main)
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setDescription([
              `\`${prefix}s lfg notifymessage\` - Set Notify Message`,
              `\`${prefix}s lfg notifychannel\` - Set Notify Channel When LFG Role Removed`,
              `\`${prefix}s lfg time\` - Set Hours Until LFG Role Removed`,
              `\`${prefix}s lfg role\` - Set LFG Role`,
              ``,
              `${bot.emoji.info} Use these commands for more information!`])
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
      } else if (bot.premium.get(message.guild.id) === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription([
            `💎 **Premium Feature** 💎`,
            ``,
            `The **Looking For Group** system is premium! Support the developers and motivate them to continue investing hours a day into ${bot.user}. View the available packages [here](${bot.config.donatelink}).`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    } else {
      let embed = new MessageEmbed()
        .setAuthor(`${b} Advanced Settings Menu`)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setColor(bot.colors.main)
        .setFooter(bot.footer)
        .setDescription([
          `Here you'll be able to customize ${bot.user} for your server!`,
          ``,
          `**Available Settings:**`,
          `\`${prefix}s 8ball\` - Magic 8 Ball Settings`,
          `\`${prefix}s media\` - Server Media Settings`,
          `\`${prefix}s lfg\` - Looking For Group Settings - **(PREMIUM)**`,
          `\`${prefix}s prefix\` - Manage Custom Prefix - (\`${prefix}\`)`,
          `\`${prefix}s toggle\` - Enable/Disable Commands`,
          `\`${prefix}s toggled\` - View Disabled Commands`,
          ``,
          `\`${prefix}s funchannel\` - Manage Fun Commands Channel`,
          `\`${prefix}s minigamechannel\` - Manage Minigames Channel`,
          `\`${prefix}s miscellaneouschannel\` - Manage Miscellaneous Commands Channel`,
          `\`${prefix}s reactionchannel\` - Manage Reaction Commands Channel`,
          ``,
          `${bot.emoji.info} Use these commands for more information!`])
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
  }
}