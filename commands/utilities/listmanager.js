const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["lm"],
  category: "UTILITIES",
  description: "Create a list of items that anyone can randomize or view - Requires `Manage Server` To Edit",
  emoji: "❔",
  name: "listmanager",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let subcommand = args[0] ? args[0].toLowerCase() : args[0]
    if (subcommand && !["r", "randomize", "view", "v"].includes(subcommand) && !message.member.hasPermission("MANAGE_GUILD")) return;
    if (!subcommand && message.member.hasPermission("MANAGE_GUILD")) {
      let embed = new MessageEmbed()
        .setAuthor(bot.translate(bot, language, "listmanager.helptitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.main)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(bot.translate(bot, language, "listmanager.help").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INFO}/g, bot.emoji.info))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    if (["view", "v"].includes(subcommand)) {
      let lists = JSON.parse(guildData.listmanager);
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let listarray = [];
      lists.forEach(list => {
        listarray.push(`**•** ${list.name} (${list.items.length}) - ${list.creationdate.split(" ")[0].replace(",", "")}`);
      });
      let finallistarray = lists.length === 0 ? `*${bot.translate(bot, language, "none")}*` : listarray.join("\n");
      let listname = args.slice(1).join(" ")
      if (listname && listnames.includes(listname.toLowerCase())) {
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
        let items = list.items.length === 0 ? `*${bot.translate(bot, language, "none")}*` : list.items.map(i => `**•** ${i.trim()}`).join("\n");
        if (message.member.hasPermission("MANAGE_GUILD")) {
          let hastetext = [
            `Magic8 - ${message.guild.name} - List Manager`,
            ``,
            `Current Items for: ${list.name}`,
            `${list.items.map(i => i.trim()).join(" | ")}`,
            ``,
            ``,
            `This link will expire! Save this when you can!`,
          ]
          bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
            setTimeout(async () => {
              message.channel.send(`**Preformatted Items:** ${haste}`)
            }, 1000)
          }).catch(e => { return bot.error(bot, message, language, e); })
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "listmanager.viewitemstitle"))
          .setDescription(bot.translate(bot, language, "listmanager.viewitems").join("\n")
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{CREATED}/g, list.creationdate.split(" ")[0].replace(",", ""))
            .replace(/{ITEMS}/g, items));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (listname && !listnames.includes(listname.toLowerCase())) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, finallistarray)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let embed = new MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "listmanager.viewliststitle"))
        .setDescription(bot.translate(bot, language, "listmanager.viewlists").join("\n")
          .replace(/{LISTS}/g, finallistarray)
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (["r", "randomize"].includes(subcommand)) {
      if (bot.listscooldown.has(message.author.id)) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.cooldown")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolistsavailable").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**•** ${l.name} (${l.items.length})`);
      })
      if (!args[1]) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "listmanager.randomizermenutitle"))
          .setDescription(bot.translate(bot, language, "listmanager.randomizermenu").join("\n")
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let end;
      try {
        end = JSON.parse(args[args.length - 1]);
      } catch (e) {
        end = false;
      }
      if (!end) {
        let listname = args.slice(1).join(" ");
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
        if (!list) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, listname)
              .replace(/{LISTS}/g, listsarray.join("\n"))
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let cooldown = guildData.randomizercooldown;
        bot.listscooldown.set(message.author.id, Date.now());
        setTimeout(async () => {
          bot.listscooldown.delete(message.author.id);
        }, (cooldown * 1000));
        let randomitem = list.items[Math.floor(Math.random() * list.items.length)];
        let embed = new MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setFooter(bot.translate(bot, language, "listmanager.footer")
            .replace(/{LISTNAME}/g, list.name))
          .setDescription(bot.translate(bot, language, "listmanager.singlerandomizing").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.singlerandomize")));
        let embedMessage;
        embedMessage = await message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        setTimeout(async () => {
          embed.setDescription(bot.translate(bot, language, "listmanager.randomizationsuccess").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.singlerandomize"))
            .replace(/{RANDOMIZED}/g, randomitem))
          embed.setColor(bot.colors.green)
          embedMessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
        }, 2000);
      } else {
        let randomcount = Math.abs(Math.floor(parseInt(args.pop())))
        let listname = args.slice(1).join(" ")
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase())
        if (!list) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, listname)
              .replace(/{LISTS}/g, listsarray.join("\n"))
              .replace(/{INFO}/g, bot.emoji.info));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        if (!randomcount || randomcount < 2 || randomcount > list.items.length) {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidnumber").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, randomcount)
              .replace(/{MAX}/g, list.items.length));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        }
        let cooldown = guildData.randomizercooldown;
        bot.listscooldown.set(message.author.id, Date.now());
        setTimeout(async () => {
          bot.listscooldown.delete(message.author.id);
        }, (cooldown * 1000));
        let randomized = [];
        for (i = 0; i < randomcount; i++) {
          let randomitem = list.items[Math.floor(Math.random() * list.items.length)];
          if (randomized.includes(randomitem)) {
            randomcount++;
            continue;
          }
          randomized.push(randomitem);
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setFooter(bot.translate(bot, language, "listmanager.footer")
            .replace(/{LISTNAME}/g, list.name))
          .setDescription(bot.translate(bot, language, "listmanager.multirandomizing").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{COUNT}/g, randomcount)
            .replace(/{LOADING}/g, bot.emoji.loading)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.multirandomize")));
        let embedMessage;
        embedMessage = await message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
        setTimeout(async () => {
          embed.setDescription(bot.translate(bot, language, "listmanager.randomizationsuccess").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.multirandomize"))
            .replace(/{RANDOMIZED}/g, randomized.join("\n")));
          embed.setColor(bot.colors.green);
          embedMessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
        }, 2000)
      }
    } else if (subcommand === "create") {
      let lists = JSON.parse(guildData.listmanager);
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let max = bot.maxlists.get(bot.premium.get(message.guild.id));
      if (lists.length >= max) {
        let upgradestring;
        if ([0, 1].includes(bot.premium.get(message.guild.id))) {
          upgradestring = bot.translate(bot, language, "listmanager.upgrade.description")
            .replace(/{OPTIONS}/g, bot.premium.get(message.guild.id) === 1 ?
              bot.translate(bot, language, "triple") :
              bot.translate(bot, language, "singleortriple"))
            .replace(/{DONATELINK}/g, bot.config.donatelink);
        } else {
          upgradestring = bot.translate(bot, language, "listmanager.upgrade.cannotupgrade");
        }
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.reachedlimit").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{MAX}/g, max)
            .replace(/{UPGRADE}/g, upgradestring)
            .replace(/{CURRENTLISTS/g, lists.map(l => `**•** ${l.name} (${l.items.length})`).join("\n"))
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nonewlistname")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (listname.length > 30) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.listnametoolong").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (listnames.includes(listname.toLowerCase())) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.listalreadyexists").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let date = new Date().toLocaleString("en");
      let listobject = {
        name: listname,
        creationdate: date,
        items: []
      };
      lists.push(listobject);
      bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "listmanager.listcreated").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{LISTNAME}/g, listname)
          .replace(/{DATE}/g, date)
          .replace(/{INFO}/g, bot.emoji.info)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "delete") {
      let lists = JSON.parse(guildData.listmanager);
      let listname = args.slice(1).join(" ");
      if (lists.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolistsavailable").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listcopy = [];
      lists.forEach(l => {
        listcopy.push(l.name.toLowerCase());
      })
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**•** ${l.name}`);
      });
      let list = lists.find(l => l.name === listname.toLowerCase());
      if (!list) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let hastetext = [
        `Magic8 - ${message.guild.name} - List Manager`,
        ``,
        `Current Items for: ${list.name}`,
        `${list.items.map(i => i.trim()).join(" | ")}`,
        ``,
        ``,
        `This link will expire! Save this when you can!`,
      ];
      bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
        lists.splice(listcopy.indexOf(list.name), 1);
        bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.translate(bot, language, "listmanager.listdeleted").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{ITEMSLINK}/g, haste));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "bulkadd") {
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolistsavailable").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**•** ${l.name} (${l.items.length})`);
      });
      let listname = args.slice(1).join(" ");
      if (!listname) {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "listmanager.bulkaddmenutitle"))
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "listmanager.bulkaddmenu").join("\n")
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (!list) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
      let hastetext = [
        `Magic8 - ${message.guild.name} - List Manager`,
        ``,
        `Current Items for: ${list.name}`,
        `${list.items.map(i => i.trim()).join(" | ")}`,
        ``,
        ``,
        `This link will expire! Save this when you can!`,
      ];
      bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(bot.translate(bot, language, "listmanager.bulkaddmenutitle"))
          .setDescription(bot.translate(bot, language, "listmanager.bulkadding").join("\n")
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{LINK}/g, haste));
        return message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content
          message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ["time"] }).then(collected => {
            let items = collected.first().content.split("|");
            let cleanItems = items.map(i => i.trim()).filter(i => i.length >= 2);
            if (cleanItems < 2) {
              m.delete({ timeout: 500 }).catch(e => { });
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "listmanager.bulkaddinvalid").join("\n")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{INFO}/g, bot.emoji.info));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            m.delete({ timeout: 500 }).catch(e => { });
            cleanItems.forEach(i => {
              list.items.push(i);
            })
            bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
            let embed = new MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription(bot.translate(bot, language, "listmanager.bulkaddsuccess").join("\n")
                .replace(/{CHECK}/g, bot.emoji.check)
                .replace(/{LISTNAME}/g, list.name)
                .replace(/{ITEMS}/g, list.items.map(i => `**•** ${i.trim()}`).join("\n")));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          }).catch(collected => {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "listmanager.bulkaddnoitems").join("\n")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{INFO}/g, bot.emoji.info));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          })
        }).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => {
        bot.error(bot, message, language, e);
      });
    } else if (subcommand === "add") {
      let lists = JSON.parse(guildData.listmanager);
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**•** ${l.name} (${l.items.length})`);
      });
      if (lists.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolistsavailable").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listname = args.slice(1).join(" ");
      if (!listname) {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "listmanager.addmenutitle"))
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "listmanager.addmenu").join("\n")
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase())
      if (!list) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let hastetext = [
        `Magic8 - ${message.guild.name} - List Manager`,
        ``,
        `Current Items for: ${list.name}`,
        `${list.items.map(i => `${i}`).join(" | ")}`,
        ``,
        ``,
        `This link will expire! Save this when you can!`,
      ]
      bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(bot.translate(bot, language, "listmanager.addmenutitle"))
          .setDescription(bot.translate(bot, language, "listmanager.adding").join("\n")
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{LINK}/g, haste));
        return message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content
          message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(collected => {
            let item = collected.first().content;
            list.items.push(item);
            bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
            bot.hastebin(list.items.map(i => i.trim()).join(" | "), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription(bot.translate(bot, language, "listmanager.addsuccess").join("\n")
                  .replace(/{CHECK}/g, bot.emoji.check)
                  .replace(/{LISTNAME}/g, list.name)
                  .replace(/{ITEMS}/g, list.items.map(i => `**•** ${i.trim()}`).join("\n")))
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }).catch(e => {
              bot.error(bot, message, language, e);
            });
          }).catch(collected => {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "listmanager.addnoitems").join("\n")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{INFO}/g, bot.emoji.info))
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          });
        }).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "remove") {
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolistsavailable").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let listsarray = [];
      lists.forEach(list => {
        listsarray.push(`**•** ${list.name}`);
      });
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "listmanager.removemenutitle"))
          .setColor(bot.colors.main)
          .setDescription(bot.translate(bot, language, "listmanager.removemenu").join("\n")
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
      if (!list) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (list.items.length === 0) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.noitemstoremove").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let hastetext = [
        `Magic8 - ${message.guild.name} - List Manager`,
        ``,
        `Current Items for: ${list.name}`,
        `${list.items.map(i => i.trim()).join(" | ")}`,
        ``,
        ``,
        `This link will expire! Save this when you can!`,
      ]
      bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
        let embed = new MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(bot.translate(bot, language, "listmanager.removemenutitle"))
          .setDescription(bot.translate(bot, language, "listmanager.removing").join("\n")
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{LINK}/g, haste));
        return message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content;
          message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
            let item = collected.first().content
            if (item.toLowerCase() === "all") {
              m.delete({ timeout: 500 }).catch(e => { });
              let hastetext = [
                `Magic8 - ${message.guild.name} - List Manager`,
                ``,
                `Old Items for: ${list.name}`,
                `${list.items.map(i => i.trim()).join(" | ")}`,
                ``,
                ``,
                `This link will expire! Save this when you can!`,
              ]
              bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
                list.items = [];
                bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
                let embed = new MessageEmbed()
                  .setColor(bot.colors.green)
                  .setDescription(bot.translate(bot, language, "listmanager.removedall").join("\n")
                    .replace(/{CHECK}/g, bot.emoji.check)
                    .replace(/{LISTNAME}/g, list.name)
                    .replace(/{LINK}/g, haste));
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
              }).catch(e => { return bot.error(bot, message, language, e); });
            }
            let itemscopy = [];
            list.items.forEach(i => {
              itemscopy.push(i.toLowerCase())
            })
            if (!itemscopy.includes(item.toLowerCase())) {
              m.delete({ timeout: 500 }).catch(e => { });
              let embed = new MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription(bot.translate(bot, language, "listmanager.removeinvalid").join("\n")
                  .replace(/{CROSS}/g, bot.emoji.cross)
                  .replace(/{INPUT}/g, item)
                  .replace(/{INFO}/g, bot.emoji.info)
                  .replace(/{PREFIX}/g, prefix));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }
            m.delete({ timeout: 500 }).catch(e => { });
            list.items.splice(itemscopy.indexOf(item.toLowerCase()), 1);
            bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id)
            let hastetext = [
              `Magic8 - ${message.guild.name} - List Manager`,
              ``,
              `Old Items for: ${list.name}`,
              `${list.items.map(i => i.trim()).join(" | ")}`,
              ``,
              ``,
              `This link will expire! Save this when you can!`,
            ]
            bot.hastebin(hastetext.join("\n"), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let embed = new MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription(bot.translate(bot, language, "listmanager.removesuccess").join("\n")
                  .replace(/{CHECK}/g, bot.emoji.check)
                  .replace(/{LISTNAME}/g, list.name)
                  .replace(/{LINK}/g, haste));
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
            }).catch(e => { return bot.error(bot, message, language, e); });
          }).catch(collected => {
            let embed = new MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "listmanager.removenoitems").join("\n")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{INFO}/g, bot.emoji.info));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
          })
        }).catch(e => { return bot.error(bot, message, language, e); });
      }).catch(e => { return bot.error(bot, message, language, e); });
    } else if (subcommand === "cooldown") {
      if (!args[1]) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.cooldownmenu").join("\n")
            .replace(/{CURRENTCOOLDOWN}/g, guildData.randomizercooldown)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      if (isNaN(args[1])) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.notanumber").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, args[1])
            .replace(/{INFO}/g, bot.emoji.info));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      let number = Math.abs(Math.floor(parseInt(args[1])))
      if (number > 300) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.toobig")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else if (number < 5) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.toosmall")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
      bot.db.prepare("UPDATE guilddata SET randomizercooldown=? WHERE guildid=?").run(number, message.guild.id);
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription(bot.translate(bot, language, "listmanager.cooldownupdated").join("\n")
          .replace(/{CHECK}/g, bot.emoji.check)
          .replace(/{NEWCOOLDOWN}/g, number));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    } else {
      if (message.member.hasPermission("MANAGE_GUILD")) {
        let embed = new MessageEmbed()
          .setAuthor(bot.translate(bot, language, "listmanager.helptitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "listmanager.help").join("\n")
            .replace(/{PREFIX}/g, prefix)
            .replace(/{INFO}/g, bot.emoji.info))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else return;
    }
  }
}