const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "message",
  run: async (bot, message) => {
    // bot.users.fetch(message.author.id).catch(e => { })
    // message.guild.members.fetch().catch(e => { });
    if (message.type !== "DEFAULT") return;
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.channel.id === "766108811978080267") {
      bot.latestupdate.set("latestupdate", bot.channels.cache.get("766108811978080267").messages.cache.first().content)
    }
    if (message.author.id === bot.developer.id && message.content === "getupdate") {
      bot.latestupdate.set("latestupdate", bot.channels.cache.get("766108811978080267").messages.cache.first().content)
    }
    let guildData;
    if (!bot.prefixes.has(message.guild.id)) {
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
      if (!guildData) {
        bot.utils.registerGuild(bot, message.guild);
        guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
      }
      bot.prefixes.set(message.guild.id, guildData.prefix);
    }
    let prefix = bot.prefixes.get(message.guild.id);
    if (message.mentions.users.has(bot.user.id)) {
      if (message.content && [`<@${bot.user.id}>`, `<@!${bot.user.id}>`].includes(message.content.trim())) {
        message.react("693828165172461638").catch(e => { });
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
        if (!guildData) {
          bot.utils.registerGuild(bot, message.guild);
          guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
        }
        let language = bot.utils.getLanguage(bot, guildData.language);
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "mention").join("\n")
            .replace(/{USER}/g, message.author)
            .replace(/{PREFIX}/g, prefix)
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{INVITE}/g, bot.invite)
            .replace(/{GUIDE}/g, bot.docs.main));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
    if (bot.antipingusers.has(message.guild.id) && message.content && message.mentions.members.keyArray().length >= 1 && !message.mentions.members.keyArray().includes(message.author.id)) {
      let tagged = bot.antipingusers.get(message.guild.id).filter(e => message.mentions.members.keyArray().includes(e));
      if (tagged.length >= 1) {
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
        if (!guildData) {
          bot.utils.registerGuild(bot, message.guild);
          guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
        }
        let member = message.guild.members.cache.get(message.author.id)
        let getbypassroles = JSON.parse(guildData.antipingbypassroles);
        let hasroles = false;
        getbypassroles.forEach(role => {
          if (message.guild.roles.cache.has(role)) {
            if (member.roles.cache.has(role)) {
              hasroles = true;
            }
          }
        })
        if (!hasroles) {
          message.delete({ timeout: 250 }).catch(e => { });
          console.log(`🔕 Anti-Ping Caught @ ${message.guild.name} (${message.guild.id})`)
          let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
          if (!guildData) {
            bot.utils.registerGuild(bot, message.guild);
            guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
          }
          if (guildData.antipingmessage.length >= 1) {
            message.channel.send((guildData.antipingmessage).replace(/{USER}/g, message.author)).catch(e => { });
          }
          if (bot.antipinglogchannels.has(message.guild.id) && message.guild.channels.cache.has(bot.antipinglogchannels.get(message.guild.id))) {
            let mentionsarray = [];
            tagged.forEach(t => {
              mentionsarray.push(bot.users.cache.get(t))
            })
            let logchannel = message.guild.channels.cache.get(bot.antipinglogchannels.get(message.guild.id))
            let language = bot.utils.getLanguage(bot, guildData.language);
            let embed = new MessageEmbed()
              .setColor(bot.colors.lightred)
              .setDescription(bot.translate(bot, language, "antiping.logmessage").join("\n")
                .replace(/{WARNING}/g, bot.emoji.warning)
                .replace(/{USER}/g, message.author)
                .replace(/{PINGED}/g, mentionsarray.join("\n")));
            return logchannel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
        }
      }
    }
    if (!message.content.startsWith(prefix) && !message.content.startsWith(`<@${bot.user.id}>`) && !message.content.startsWith(`<@!${bot.user.id}>`)) return;
    // if (message.author.id !== "292821168833036288") return message.channel.send("Hey there! I'm updating right now so you can't use any commands. I'll be back soon!")
    if (!bot.adtype.has(message.guild.id)) bot.adtype.set(message.guild.id, 0);
    if (!bot.usage.has(message.guild.id)) bot.usage.set(message.guild.id, 0);
    let startedwith;
    if (message.content.startsWith(prefix)) startedwith = prefix.length;
    if (message.content.startsWith(`<@${bot.user.id}>`)) startedwith = `<@${bot.user.id}>`.length;
    if (message.content.startsWith(`<@!${bot.user.id}>`)) startedwith = `<@!${bot.user.id}>`.length;
    let args = message.content.slice(startedwith).trim().split(" ");
    let cmd = args.shift().toLowerCase();
    let command;
    if (bot.commands.has(cmd)) {
      command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
      command = bot.commands.get(bot.aliases.get(cmd));
    } else return;
    if (command.dev && !["290640988677079041", "292821168833036288", "390124364198313985", "288035704162746378"].includes(message.author.id)) return;
    if (!guildData) {
      guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(message.guild.id);
    }
    if (command.category === "ADMINISTRATOR" && command.name !== "language" && !message.member.hasPermission("MANAGE_GUILD")) return;
    if (command.category === "ENTERTAINMENT" && bot.funchannels.has(message.guild.id) && bot.funchannels.get(message.guild.id).length >= 1 && !bot.funchannels.get(message.guild.id).includes(message.channel.id)) return;
    if (command.category === "MINIGAME" && bot.minigamechannels.has(message.guild.id) && bot.minigamechannels.get(message.guild.id).length >= 1 && !bot.minigamechannels.get(message.guild.id).includes(message.channel.id)) return;
    if (command.category === "MISCELLANEOUS" && bot.miscellaneouschannels.has(message.guild.id) && bot.miscellaneouschannels.get(message.guild.id).length >= 1 && !bot.miscellaneouschannels.get(message.guild.id).includes(message.channel.id)) return;
    if (command.category === "REACTIONS" && bot.reactionchannels.has(message.guild.id) && bot.reactionchannels.get(message.guild.id).length >= 1 && !bot.reactionchannels.get(message.guild.id).includes(message.channel.id)) return;
    if (command.toggleable && bot.disabledcommands.has(message.guild.id) && bot.disabledcommands.get(message.guild.id).includes(command.name)) return;
    command.run(bot, message, args, prefix, guildData);
    if (command.dev) return;
    bot.statcord.postCommand(command.name, message.author.id);
    bot.usage.set(message.guild.id, (bot.usage.get(message.guild.id) + 1));
    if (guildData.hasvoted === "false" && (bot.usage.get(message.guild.id) % 50 === 0) && bot.premium.get(message.guild.id) === 0) {
      let ad = bot.ads[bot.adtype.get(message.guild.id)];
      console.log(`🗨️ ${ad.name} Advertisement Sent In: ${message.guild.name} (${message.guild.id})`);
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(`${ad.name} - Advertisement`)
        .setFooter(`Want your Advertisement here? Contact Fyrlex#2740`)
        .setDescription(ad.description.join("\n")
          .replace(/{BOT}/g, bot.user)
          .replace(/{VOTELINK}/g, bot.config.vote.dbl)
          .replace(/{INVITE}/g, bot.invite)
          .replace(/{ADSINFO}/g, bot.docs.ads)
          .replace(/{INFO}/g, bot.emoji.info));
      if (ad.image) embed.setImage(ad.image);
      if (ad.thumbnail) embed.setThumbnail(ad.thumbnail);
      message.channel.send(embed).then(m => m.delete({ timeout: 60000 }).catch(e => { })).catch(e => { });
      bot.adtype.set(message.guild.id, (bot.adtype.get(message.guild.id) + 1))
      if (bot.adtype.get(message.guild.id) > 3) {
        bot.adtype.set(message.guild.id, 0);
      }
    }
    let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(message.guild.id);
    if (!usageData) {
      bot.utils.registerGuildUsage(bot, guild);
      usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(message.guild.id);
    }
    let x = JSON.parse(usageData.usage);
    let find = x.find(i => i.command === command.name);
    if (!find) {
      let o = {
        command: command.name,
        usage: 1
      };
      x.push(o);
      bot.udb.prepare("UPDATE usagedata SET usage=? WHERE guildid=?").run(JSON.stringify(x), message.guild.id);
    } else {
      find.usage = find.usage + 1;
      bot.udb.prepare("UPDATE usagedata SET usage=? WHERE guildid=?").run(JSON.stringify(x), message.guild.id);
    }
    let bots = message.guild.members.cache.filter(c => c.user.bot).size;
    let channels = message.guild.channels.cache.filter(c => c.type !== "category").size;
    let split = new Date().toLocaleString().split(" ");
    let formattedTime = `${split[1]}${split[2]}`;
    let performedCommand = `${command.emoji} __${formattedTime}__` +
      ` **C:** \`${command.name}\` **| A:** \`${message.author.tag}\` **| S/ID:** \`${message.guild.name} (${message.guild.id})\` (${message.guild.members.cache.size - bots}/${bots}/${channels}) **| Full:** \`${message.content}\``;
    let commandsChannel = bot.channels.cache.get(bot.config.commandlogs);
    if (commandsChannel) commandsChannel.send(performedCommand).catch(e => { });
    // let t = new Date().toLocaleString("en").replace(/,/g, "")
    // console.log(`${t} ${command.emoji} C: ${command.name} - A: ${message.author.tag} - S/ID: ${message.guild.name} (${message.guild.id}) (${bot.users.cache.size - bots}/${bots}/${online}/${channels}) - Full: ${message.content}`)
    return;
  }
}