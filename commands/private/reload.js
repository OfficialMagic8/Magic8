// const { loadLanguageProgress, loadPrefixes, loadUsage, loadAutoVoiceChannels, loadRestrictedChannels, loadLFGNotificationChannels, loadLFGRoles, loadAntiPingUsers, loadAntiPingChannels, loadMonthlyVotes, loadTotalVotes, loadVotedUsers, loadEmojis } = require(".../utils/load")
const functions = ["loadLanguageProgress", "loadPrefixes", "loadUsage", "loadAutoVoiceChannels", "loadRestrictedChannels", "loadLFGNotificationChannels", "loadLFGRoles", "loadAntiPingUsers", "loadAntiPingChannels", "loadMonthlyVotes", "loadTotalVotes", "loadVotedUsers", "loadEmojis"]
const Discord = require("discord.js");
module.exports = {
  aliases: [],
  category: "",
  description: "Reload a load function",
  emoji: "🔄",
  name: "reload",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    // if (!args[0]) {
    //   let embed = new Discord.MessageEmbed()
    //     .setColor(bot.colors.red)
    //     .setDescription([
    //       `${bot.emoji.cross} **Please type a function.**`,
    //       ``,
    //       `${functions.map(f => `\`${f}\``).join(" ")}`])
    //   return message.channel.send(embed).catch(e => { })
    // }
    // if (!functions.includes(args[0])) {
    //   let embed = new Discord.MessageEmbed()
    //     .setColor(bot.colors.red)
    //     .setDescription([
    //       `${bot.emoji.cross} **Invalid Function:** \`${args[0]}\``,
    //       ``,
    //       `**Available Functions:**`,
    //       `${functions.map(f => `\`${f}\``).join(" ")}`])
    //   return message.channel.send(embed).catch(e => { })
    // }
    // let runfunction = args[0]
    // runfunction(bot);
  }
}  