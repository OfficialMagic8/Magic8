const { MessageEmbed } = require("discord.js")
module.exports = {
  aliases: ["bi", "binfo"],
  category: "INFORMATION",
  description: "Magic8 Bot Information",
  emoji: "📚",
  name: "botinfo",
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let uptime = bot.ms(bot.uptime);
    // let memory = getMemoryUsage();
    // let maxRam = 2048;
    // console.log(`~ RAM: ${memory}/${maxRam} MB (${Math.round((memory * 100) / maxRam)}%)`);
    // let guildsize = bot.getguilds(bot);
    // console.log(guildsize)
    // let getguilds = await bot.shard.broadcastEval('this.guilds.cache.size').catch(e => { })
    // let guilds = parseInt(getguilds.reduce((acc, guildCount) => acc + guildCount, 0)).toLocaleString("en")
    // let getchannels = await bot.shard.broadcastEval('this.channels.cache.size').catch(e => { })
    // let channels = parseInt(getchannels.reduce((acc, channelCount) => acc + channelCount, 0)).toLocaleString("en")
    let embed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "botinfo.title").replace(/{BOTNAME}/g, bot.user.username))
      .setColor(bot.colors.main)
      .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
      // .setFooter(bot.translate(bot, language, "botinfo.footer")
      //   .replace(/{CPU}/g, bot.os.cpus().shift().model))
      .setDescription(bot.translate(bot, language, "botinfo.description").join("\n")
        .replace(/{GUILDS}/g, parseInt(bot.guilds.cache.size).toLocaleString("en"))
        .replace(/{USERS}/g, bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString("en"))
        .replace(/{CHANNELS}/g, parseInt(bot.channels.cache.size).toLocaleString("en"))
        // .replace(/{NSFWCHANNELS}/g, bot.channels.cache.filter(c => c.nsfw).size.toLocaleString("en"))
        // .replace(/{RAM}/g, `${memory}/${maxRam} MB (${Math.round((memory * 100) / maxRam)}%)`)
        .replace(/{DJS}/g, bot.emoji.djs)
        .replace(/{DJSVERSION}/g, bot.pack.dependencies["discord.js"].replace(/\^/g, ""))
        .replace(/{NODE}/g, bot.emoji.node)
        .replace(/{NODEVERSION}/g, bot.pack.engines.node)
        .replace(/{UPTIME}/g, uptime)
        .replace(/{PING}/g, bot.ms(bot.ws.ping))
        // .replace(/{USAGE}/g, bot.os.loadavg().pop().toFixed(1))
        .replace(/{OWNER}/g, bot.users.cache.get("292821168833036288"))
        .replace(/{HEADDEVELOPER}/g, bot.users.cache.get("290640988677079041"))
        .replace(/{GUIDE}/g, bot.docs.main)
        .replace(/{CREATIONDATE}/g, bot.user.createdAt.toLocaleString().split("GMT")[0].trim())
        .replace(/{DONATELINK}/g, bot.config.donatelink)
        .replace(/{SUPPORTSERVER}/g, bot.invite)
        .replace(/{GITHUB}/g, bot.github.languages)
        .replace(/{STATUS}/g, bot.config.status)
        .replace(/{PROGRESS}/g, bot.docs.progress));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    // function getMemoryUsage() {
    //   let total_rss = bot.fs.readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8").split("\n").filter(l => l.startsWith("total_rss"))[0].split(" ")[1];
    //   return Math.round(Number(total_rss) / 1e6) - 60;
    // }
  }
}