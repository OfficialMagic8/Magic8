const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["mcstatus", "status"],
  category: "MINECRAFT",
  description: "Check your own server status",
  emoji: "🎮",
  name: "mcserver",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    if (message.member.hasPermission("MANAGE_GUILD")) {
      if (args[0] && args[0].toLowerCase() === "help") {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "mcserver.menutitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setDescription(bot.translate(bot, language, "mcserver.helpmenu").join("\n")
            .replace(/{PREFIX}/g, prefix)
            .replace(/{INFO}/g, bot.emoji.info))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (args[0] && args[0].toLowerCase() === "remove") {
        bot.db.prepare("UPDATE guilddata SET mcserverip=? WHERE guildid=?").run("none", message.guild.id);
        bot.mcservers.delete(message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "mcserver.removed")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (args[0] && args[0].toLowerCase() === "set") {
        if (!args[1]) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setAuthor(bot.translate(bot, language, "mcserver.menutitle")
              .replace(/{BOTNAME}/g, bot.user.username))
            .setDescription(bot.translate(bot, language, "mcserver.setmenu").join("\n")
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e,); })
        }
        let updating = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "mcserver.checking")
            .replace(/{LOADING}/g, bot.emoji.loading));
        let updatingMessage = await message.channel.send(updating).catch(e => { return bot.error(bot, message, language, e); });
        let tryip = await bot.fetch(`https://api.mcsrvstat.us/2/${args[1]}`).then(res => res.json()).then(json => {
          return json.ip;
        }).catch(e => { return bot.error(bot, message, language, e); });
        if (tryip.length >= 1) {
          bot.db.prepare("UPDATE guilddata SET mcserverip=? WHERE guildid=?").run(args[1], message.guild.id);
          bot.mcservers.set(message.guild.id, args[1]);
          updating.setColor(bot.colors.green);
          updating.setFooter(bot.translate(bot, language, "mcserver.javawarning"))
          updating.setDescription(bot.translate(bot, language, "mcserver.updated").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{SERVER}/g, args[1])
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
          updatingMessage.edit(updating).catch(e => { return bot.error(bot, message, language, e); });
        } else {
          updating.setColor(bot.colors.red);
          updating.setFooter(bot.translate(bot, language, "mcserver.errorfooter"));
          updating.setDescription(bot.translate(bot, language, "mcserver.error").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{SERVER}/g, args[1]));
          updatingMessage.edit(updating).catch(e => { return bot.error(bot, message, language, e); });
        }
      } else {
        checkStatus(bot, message)
      }
    } else {
      checkStatus(bot, message)
    }
    async function checkStatus() {
      if (bot.mcservers.has(message.guild.id)) {
        let server = bot.mcservers.get(message.guild.id);
        let url = `https://eu.mc-api.net/v3/server/favicon/${server}`
        let thumbnail;
        try {
          thumbnail = await bot.canvas.loadImage(url).then(image => { return url; })
        } catch (e) { }
        bot.fetch(`https://api.mcsrvstat.us/2/${server}`).then(res => res.json()).then(data => {
          let getplayers = data.players.list ? data.players.list : false;
          if (getplayers) {
            let mapped = getplayers.map(p => `**•** ${p.replace(/_/g, "\\_")}`);
            let size = mapped.length;
            let math = size / 8;
            let fullpagecount = Math.floor(math);
            let totalpages;
            if (!Number.isInteger(math)) {
              totalpages = fullpagecount + 1;
            } else {
              totalpages = fullpagecount;
            }
            let page = args[0] ? Math.abs(Math.floor(parseInt(args[0]))) : 1;
            if (isNaN(page) || page > totalpages || page < 1) {
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "mcserver.invalidpage").join("\n")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{INPUT}/g, page)
                  .replace(/{INFO}/g, bot.emoji.info)
                  .replace(/{TOTALPAGES}/g, totalpages));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            let lastitemindex = page * 8;
            let selectedplayers = [];
            for (map of mapped) {
              if (page === totalpages) {
                if (mapped.indexOf(map) + 1 <= size && mapped.indexOf(map) + 1 > fullpagecount * 8) {
                  selectedplayers.push(map);
                }
              }
              if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 8) {
                if (!selectedplayers.includes(map)) selectedplayers.push(map);
              }
            }
            let embed = new MessageEmbed()
              .setColor(data.online ? bot.colors.main : bot.colors.red)
              //         http://status.mclive.eu/play.mc-blaze.com/play.mc-blaze.com/25565/banner.png
              .setImage(`http://status.mclive.eu/${server}/${server}/25565/banner.png`)
              .setDescription(bot.translate(bot, language, "mcserver.status").join("\n")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{STATUS}/g, data.online ? bot.translate(bot, language, "mcserver.online") : bot.translate(bot, language, "mcserver.offline"))
                .replace(/{SERVER}/g, server)
                .replace(/{VERSIONS}/g, data.version ? data.version : bot.translate(bot, language, "none"))
                .replace(/{ONLINEPLAYERS}/g, data.players.online ? data.players.online : "0")
                .replace(/{MAXPLAYERS}/g, data.players.max ? data.players.max : "0")
                .replace(/{PLAYERS}/g, getplayers ? `${selectedplayers.join("\n")}\n` : "")
                .replace(/{HASPAGES}/g, bot.translate(bot, language, "mcserver.haspages")
                  .replace(/{INFO}/g, bot.emoji.info)))
              .setFooter(bot.translate(bot, language, "mcserver.pagefooter")
                .replace(/{PAGE}/g, page)
                .replace(/{TOTALPAGES}/g, totalpages));
            if (thumbnail) embed.setThumbnail(thumbnail);
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          } else {
            let embed = new MessageEmbed()
              .setColor(data.online ? bot.colors.main : bot.colors.red)
              .setImage(`http://status.mclive.eu/${server}/${server}/25565/banner.png`)
              .setDescription(bot.translate(bot, language, "mcserver.status").join("\n")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{STATUS}/g, data.online ? bot.translate(bot, language, "mcserver.online") : bot.translate(bot, language, "mcserver.offline"))
                .replace(/{SERVER}/g, server)
                .replace(/{VERSIONS}/g, data.version ? data.version : bot.translate(bot, language, "none"))
                .replace(/{ONLINEPLAYERS}/g, data.players.online ? data.players.online : "0")
                .replace(/{MAXPLAYERS}/g, data.players.max ? data.players.max : "0")
                .replace(/{PLAYERS}/g, "")
                .replace(/{HASPAGES}/g, ""));
            if (thumbnail) embed.setThumbnail(thumbnail);
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }
        }).catch(e => {
          console.error(e)
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setFooter(bot.translate(bot, language, "mcserver.errorfooter"))
            .setDescription(bot.translate(bot, language, "mcserver.error").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{SERVER}/g, server));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        });
      } else {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "mcserver.noip").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
  }
}