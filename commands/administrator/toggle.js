const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["tog"],
  category: "ADMINISTRATOR",
  description: "Toggle almost any command for all users of your server.\nRequires `Manage Server` Permission",
  emoji: "⚙️",
  name: "toggle",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let disabledCommands = JSON.parse(guildData.disabledcommands)
    let max = bot.maxtoggledcommands.get(bot.premium.get(message.guild.id))
    let cmdToDisable = args[0] ? args[0].toLowerCase() : args[0];
    if (!cmdToDisable) {
      let disabled = disabledCommands.map(c => `\`${c}\``).join(" ")
      if (disabledCommands.length === 0) {
        bot.disabledcommands.delete(message.guild.id)
        disabled = `\`${bot.translate(bot, language, "none")}\``;
      }
      let max = bot.maxtoggledcommands.get(bot.premium.get(message.guild.id));
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(`${bot.user.username} - Disabled Commands: (${disabledCommands.length}/${max})`)
        .setThumbnail(bot.user.displayAvatarURL({ formant: "png" }))
        .setDescription([
          `${disabled}`,
          ``,
          `${bot.emoji.info} To disable or enable a command, type: \`${prefix}toggle <command>\``]);
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    disabledCommands.sort()
    let disabledCommandsString = disabledCommands.length === 0 ? `*${bot.translate(bot, language, "none")}*` : disabledCommands.map(c => `\`${c.trim()}\``).join(" ")
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
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (!cmdToDisable) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription([
          `${bot.emoji.cross} **Please provide a valid command to toggle.**`,
          ``,
          `${bot.emoji.info} To get a list of available commands, type: \`${prefix}help\``])
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
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
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          } else {
            if (disabledCommands.includes(commandToDisable.name)) {
              let finalDisabled = disabledCommands.filter(dc => dc !== commandToDisable.name)
              finalDisabled.sort();
              let disabledCommandsString
              if (finalDisabled.length <= 0) {
                bot.disabledcommands.delete(message.guild.id)
                disabledCommandsString = `*none*`
              } else {
                disabledCommandsString = finalDisabled.map(c => `\`${c.trim()}\``).join(" ");
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
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
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
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
          }
        }
      } else {
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
    }
  }
}