const Discord = require("discord.js")
module.exports = {
  aliases: ["bi", "binfo"],
  category: "INFO",
  description: "Magic8 Bot Information",
  emoji: "📚",
  name: "botinfo",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let uptime = bot.ms(bot.uptime);
    let memory = getMemoryUsage();
    let maxRam = 2048;
    console.log(`~ RAM: ${memory}/${maxRam} MB (${Math.round((memory * 100) / maxRam)}%)`);
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "botinfo.title").replace(/{BOTNAME}/g, bot.user.username))
      .setColor(bot.colors.main)
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      // .setFooter(bot.translate(bot, language, "botinfo.footer")
      //   .replace(/{CPU}/g, bot.os.cpus().shift().model))
      .setDescription(bot.translate(bot, language, "botinfo.description").join("\n")
        .replace(/{GUILDS}/g, bot.guilds.cache.size.toLocaleString("en"))
        .replace(/{USERS}/g, bot.users.cache.size.toLocaleString("en"))
        .replace(/{CHANNELS}/g, bot.channels.cache.size.toLocaleString("en"))
        .replace(/{NSFWCHANNELS}/g, bot.channels.cache.filter(c => c.nsfw).size.toLocaleString("en"))
        // .replace(/{RAM}/g, `${memory}/${maxRam} MB (${Math.round((memory * 100) / maxRam)}%)`)
        .replace(/{UPTIME}/g, uptime)
        .replace(/{PING}/g, bot.ms(bot.ws.ping))
        // .replace(/{USAGE}/g, bot.os.loadavg().pop().toFixed(1))
        .replace(/{OWNER}/g, bot.developer)
        .replace(/{HEADDEVELOPER}/g, bot.maindeveloper)
        .replace(/{GUIDE}/g, bot.docs.main)
        .replace(/{CREATIONDATE}/g, bot.user.createdAt.toLocaleString().split("GMT")[0].trim())
        .replace(/{DONATELINK}/g, bot.config.donatelink)
        .replace(/{SUPPORTSERVER}/g, bot.invite)
        .replace(/{GITHUB}/g, bot.github.languages))
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    function getMemoryUsage() {
      let total_rss = bot.fs.readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8").split("\n").filter(l => l.startsWith("total_rss"))[0].split(" ")[1];
      return Math.round(Number(total_rss) / 1e6) - 60;
    }
  }
}