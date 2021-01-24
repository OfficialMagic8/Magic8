const { MessageEmbed } = require("discord.js");
const repolink = "https://github.com/OfficialMagic8/Languages/blob/master/languages/{SHORTLANG}.json"
module.exports = {
  aliases: ["lang", "langs"],
  category: "ADMINISTRATOR",
  description: "Magic8 Language Settings\nRequires `Manage Server` Permission",
  emoji: "🌎",
  name: "language",
  run: async (bot, message, args, prefix, guildData) => {
    if (message.member.hasPermission("MANAGE_GUILD") || message.member.roles.cache.has("802198108112289802") || message.author.id === "292821168833036288") {
      let language = bot.utils.getLanguage(bot, guildData.language);
      let subcommand = args[0] ? args[0].toLowerCase() : args[0];
      if (subcommand === "set") {
        if (!args[1]) {
          let lastfetched = bot.lastfetched.get("lf");
          let lastfetchedms = Date.parse(lastfetched);
          let lastcommit = await bot.fetch("https://api.github.com/orgs/OfficialMagic8/repos").then(res => res.json()).then(json => {
            return Date.parse(json[0].pushed_at);
          }).catch(e => { return bot.error(bot, message, language, e); });
          let uptodatestring;
          let condition;
          if (lastfetchedms < lastcommit) {
            condition = false;
            uptodatestring = `${bot.emoji.cross} **${bot.translate(bot, language, "language.outdated")}**`;
          } else if (lastfetchedms >= lastcommit) {
            condition = true;
            uptodatestring = `${bot.emoji.check} **${bot.translate(bot, language, "language.uptodate")}**`;
          }
          let mapped = bot.languagesprogress.map((obj, lg) => `${obj.flag} [**${obj.lang}**](${repolink.replace(/{SHORTLANG}/g, lg)}) (**\`${lg}\`**): **${obj.progress}**%`);
          let languageslength = bot.languagesprogress.size;
          let math = languageslength / 5;
          let fullpagecount = Math.floor(math);
          let totalpages;
          if (!Number.isInteger(math)) {
            totalpages = fullpagecount + 1;
          } else {
            totalpages = fullpagecount;
          }
          let page = 1;
          let lastitemindex = page * 5;
          let selectedlanguages = [];
          for (map of mapped) {
            if (page === totalpages) {
              if (mapped.indexOf(map) + 1 <= languageslength && mapped.indexOf(map) + 1 > fullpagecount * 5) {
                selectedlanguages.push(map);
              }
            }
            if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 5) {
              if (!selectedlanguages.includes(map)) selectedlanguages.push(map);
            }
          }
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "language.listtitle")
              .replace(/{BOTNAME}/g, bot.user.username)
              .replace(/{PAGE}/g, page)
              .replace(/{TOTALPAGES}/g, totalpages))
            .setColor(condition ? bot.colors.main : bot.colors.red)
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setFooter(bot.translate(bot, language, "language.lastupdated")
              .replace(/{TIME}/g, bot.lastfetched.get("lf").toLocaleString(guildData.language)))
            .setDescription(bot.translate(bot, language, "language.languages").join("\n")
              .replace(/{UPTODATE}/g, uptodatestring)
              .replace(/{STATEMENT}/g, bot.translate(bot, language, "language.statements.set")
                .replace(/{INFO}/g, bot.emoji.info))
              .replace(/{LANGUAGES}/g, selectedlanguages.join("\n")));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (!bot.languages.has(args[1].toLowerCase())) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "language.invalid").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, args[1])
              .replace(/{CURRENT}/g, guildData.language)
              .replace(/{AVAILABLE}/g, bot.languages.keyArray().sort().map(lg => `\`${lg}\``).join(" "))
              .replace(/{WARNING}/g, bot.emoji.warning));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (args[1].toLowerCase() === guildData.language) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "language.alreadyselected").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{CURRENT}/g, args[1].toLowerCase())
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (bot.helpmenus.has(message.guild.id)) bot.helpmenus.delete(message.guild.id);
        if (bot.adminmenus.has(message.guild.id)) bot.adminmenus.delete(message.guild.id);
        let newLanguage = args[1].toLowerCase();
        let getlang = bot.languagesprogress.get(newLanguage);
        bot.db.prepare("UPDATE guilddata SET language=? WHERE guildid=?").run(newLanguage, message.guild.id);
        let success = new MessageEmbed()
          .setColor(bot.colors.green)
          .setFooter(bot.translate(bot, language, "language.lastupdated")
            .replace(/{TIME}/g, bot.lastfetched.get("lf").toLocaleString(guildData.language)))
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "language.updated").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{NEWLANGUAGE}/g, getlang.lang)
            .replace(/{FLAG}/g, getlang.flag)
            .replace(/{PROGRESS}/g, getlang.progress)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{INVITE}/g, bot.invite)
            .replace(/{WARNING}/g, bot.emoji.warning));
        return message.channel.send(success).catch(e => { });
      } else if (subcommand === "list") {
        let lastfetched = bot.lastfetched.get("lf")
        let lastcommit = await bot.fetch("https://api.github.com/orgs/OfficialMagic8/repos").then(res => res.json()).then(json => {
          return Date.parse(json[0].updated_at)
        }).catch(e => { return bot.error(bot, message, language, e); });
        let uptodatestring;
        let condition;
        if (lastfetched < lastcommit) {
          condition = false;
          uptodatestring = `${bot.emoji.cross} **${bot.translate(bot, language, "language.outdated")}**`;
        } else if (lastfetched >= lastcommit) {
          condition = true;
          uptodatestring = `${bot.emoji.check} **${bot.translate(bot, language, "language.uptodate")}**`;
        }
        let mapped = bot.languagesprogress.map((obj, lg) => `${obj.flag} [**${obj.lang}**](${repolink.replace(/{SHORTLANG}/g, lg)}) (**\`${lg}\`**): **${obj.progress}**%`);
        let languageslength = bot.languagesprogress.size;
        let math = languageslength / 5;
        let fullpagecount = Math.floor(math);
        let totalpages;
        if (!Number.isInteger(math)) {
          totalpages = fullpagecount + 1;
        } else {
          totalpages = fullpagecount;
        }
        let page = args[1] ? Math.abs(Math.floor(parseInt(args[1]))) : 1;
        if (isNaN(page) || page > totalpages || page < 1) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "language.invalidpage").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, args[1])
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{TOTALPAGES}/g, totalpages))
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let lastitemindex = page * 5;
        let selectedlanguages = [];
        for (map of mapped) {
          if (page === totalpages) {
            if (mapped.indexOf(map) + 1 <= languageslength && mapped.indexOf(map) + 1 > fullpagecount * 5) {
              selectedlanguages.push(map);
            }
          }
          if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 5) {
            if (!selectedlanguages.includes(map)) selectedlanguages.push(map);
          }
        }
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "language.listtitle")
            .replace(/{BOTNAME}/g, bot.user.username)
            .replace(/{PAGE}/g, page)
            .replace(/{TOTALPAGES}/g, totalpages))
          .setColor(condition ? bot.colors.main : bot.colors.red)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setFooter(bot.translate(bot, language, "language.lastupdated")
            .replace(/{TIME}/g, bot.lastfetched.get("lf").toLocaleString(guildData.language)))
          .setDescription(bot.translate(bot, language, "language.languages").join("\n")
            .replace(/{UPTODATE}/g, uptodatestring)
            .replace(/{STATEMENT}/g, bot.translate(bot, language, "language.statements.togithub")
              .replace(/{INFO}/g, bot.emoji.info))
            .replace(/{LANGUAGES}/g, selectedlanguages.join("\n")));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (subcommand === "help") {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "language.help").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{GITHUB}/g, bot.github.languages)
            .replace(/{INVITE}/g, bot.invite)
            .replace(/{TRIPLEPACKAGE}/g, bot.docs.triplepackage)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (subcommand === "info") {
        if (!args[1]) {
          let lastfetched = bot.lastfetched.get("lf")
          let lastcommit = await bot.fetch("https://api.github.com/orgs/OfficialMagic8/repos").then(res => res.json())
            .then(json => {
              return Date.parse(json[0].updated_at);
            }).catch(e => { return bot.error(bot, message, language, e); });
          let mapped = bot.languagesprogress.map((obj, lg) => `${obj.flag} [**${obj.lang}**](${repolink.replace(/{SHORTLANG}/g, lg)}) (**\`${lg}\`**): **${obj.progress}**%`);
          let languageslength = bot.languagesprogress.size;
          let math = languageslength / 5;
          let fullpagecount = Math.floor(math);
          let totalpages;
          if (!Number.isInteger(math)) {
            totalpages = fullpagecount + 1;
          } else {
            totalpages = fullpagecount;
          }
          let page = 1
          let lastitemindex = page * 5;
          let selectedlanguages = [];
          for (map of mapped) {
            if (page === totalpages) {
              if (mapped.indexOf(map) + 1 <= languageslength && mapped.indexOf(map) + 1 > fullpagecount * 5) {
                selectedlanguages.push(map);
              }
            }
            if (mapped.indexOf(map) + 1 <= lastitemindex && mapped.indexOf(map) + 1 > lastitemindex - 5) {
              if (!selectedlanguages.includes(map)) selectedlanguages.push(map);
            }
          }
          let uptodatestring;
          let condition;
          if (lastfetched < lastcommit) {
            condition = false;
            uptodatestring = `${bot.emoji.cross} **${bot.translate(bot, language, "language.outdated")}**`;
          } else if (lastfetched >= lastcommit) {
            condition = true;
            uptodatestring = `${bot.emoji.check} **${bot.translate(bot, language, "language.uptodate")}**`;
          }
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "language.listtitle")
              .replace(/{BOTNAME}/g, bot.user.username)
              .replace(/{PAGE}/g, page)
              .replace(/{TOTALPAGES}/g, totalpages))
            .setColor(condition ? bot.colors.main : bot.colors.red)
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setFooter(bot.translate(bot, language, "language.lastupdated")
              .replace(/{TIME}/g, bot.lastfetched.get("lf").toLocaleString(guildData.language)))
            .setDescription(bot.translate(bot, language, "language.languages").join("\n")
              .replace(/{UPTODATE}/g, uptodatestring)
              .replace(/{STATEMENT}/g, bot.translate(bot, language, "language.statements.info")
                .replace(/{INFO}/g, bot.emoji.info))
              .replace(/{LANGUAGES}/g, selectedlanguages.join("\n")));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (!bot.languages.has(args[1].toLowerCase())) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "language.invalid").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, args[1])
              .replace(/{CURRENT}/g, guildData.language)
              .replace(/{AVAILABLE}/g, bot.languages.keyArray().sort().map(lg => `\`${lg}\``).join(" "))
              .replace(/{WARNING}/g, bot.emoji.warning));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let getlang = bot.languagesprogress.get(args[1].toLowerCase());
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "language.info").join("\n")
            .replace(/{FLAG}/g, getlang.flag)
            .replace(/{LANGUAGENAME}/g, `[${getlang.lang}](${repolink.replace(/{SHORTLANG}/g, args[1].toLowerCase())})`)
            .replace(/{LANGUAGESHORT}/g, args[1].toLowerCase())
            .replace(/{PROGRESS}/g, getlang.progress)
            .replace(/{AUTHORS}/g, getlang.authors.map(a => `**•** ${a}`).join("\n")));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "language.menutitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setFooter(bot.translate(bot, language, "language.lastupdated")
            .replace(/{TIME}/g, bot.lastfetched.get("lf").toLocaleString(guildData.language)))
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "language.menu").join("\n")
            .replace(/{BOT}/g, bot.user)
            .replace(/{PREFIX}/g, prefix)
            .replace(/{LANGUAGE}/g, guildData.language)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }
  }
}