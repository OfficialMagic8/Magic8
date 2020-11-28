const Discord = require("discord.js");
module.exports = {
  aliases: ["lm"],
  category: "UTILITIES",
  description: "Create a list of items that anyone can randomize or view - Requires `Manage Server` To Edit",
  emoji: "❔",
  name: "listmanager",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language)
    let subcommand = args[0] ? args[0].toLowerCase() : args[0]
    if (args[0] && !["r", "randomize", "view", "v"].includes(args[0].toLowerCase()) && !message.member.hasPermission("MANAGE_GUILD")) return;
    if (!subcommand && message.member.hasPermission("MANAGE_GUILD")) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(bot.translate(bot, language, "listmanager.helptitle")
          .replace(/{BOTNAME}/g, bot.user.username))
        .setColor(bot.colors.main)
        .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
        .setDescription(bot.translate(bot, language, "listmanager.help").join("\n")
          .replace(/{PREFIX}/g, prefix)
          .replace(/{INFO}/g, bot.emoji.info))
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    } else if (["view", "v"].includes(subcommand)) {
      let lists = JSON.parse(guildData.listmanager);
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let listarray = [];
      lists.forEach(list => {
        listarray.push(`**-** ${list.name} (${list.items.length}) - ${list.creationdate.split(" ")[0].replace(",", "")}`);
      });
      let finallistarray = lists.length === 0 ? `*${bot.translate(bot, language, "none")}*` : listarray.join("\n");
      let listname = args.slice(1).join(" ")
      if (listname && listnames.includes(listname.toLowerCase())) {
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
        let items = list.items.length === 0 ? `*${bot.translate(bot, language, "none")}*` : list.items.map(i => `**-** ${i.trim()}`).join("\n");
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
          }).catch(e => {
            return bot.error(bot, message, language, e);
          })
        }
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "listmanager.viewitemstitle"))
          .setDescription(bot.translate(bot, language, "listmanager.viewitems").join("\n")
            .replace(/{LISTNAME}/g, list.name)
            .replace(/{CREATED}/g, list.creationdate.splice(" ")[0].replace(",", ""))
            .replace(/{ITEMS}/g, items));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else if (listname && !listnames.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INPUT}/g, listname)
            .replace(/{LISTS}/g, finallistarray));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.main)
        .setAuthor(bot.translate(bot, language, "listmanager.viewliststitle"))
        .setDescription(bot.translate(bot, language, "listmanager.viewlists").join("\n")
          .replace(/{LISTS}/g, finallistarray)
          .replace(/{INFO}/g, bot.emoji.info));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    } else if (["r", "randomize"].includes(subcommand)) {
      if (bot.listscooldown.has(message.author.id)) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.cooldown")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "listmanager.nolists").join("\n")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let listsarray = []
      lists.forEach(l => {
        listsarray.push(`**-** ${l.name} (${l.items.length})`);
      })
      if (!args[1]) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(bot.translate(bot, language, "listmanager.randomizermenutitle"))
          .setDescription(bot.translate(bot, language, "listmanager.randomizermenu").join("\n")
            .replace(/{LISTS}/g, listsarray.join("\n"))
            .replace(/{INFO}/g, bot.emoji.info)
            .replace(/{PREFIX}/g, prefix));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
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
        if (!listnames.includes(listname.toLowerCase())) {
          let embed = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, listname)
              .replace(/{LISTS}/g, listsarray.join("\n")));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        let cooldown = guildData.randomizercooldown;
        bot.listscooldown.set(message.author.id, Date.now());
        setTimeout(async () => {
          bot.listscooldown.delete(message.author.id);
        }, (cooldown * 1000));
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase());
        let randomitem = list.items[Math.floor(Math.random() * list.items.length)];
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setFooter(bot.translate(bot, language, "listmanager.footer")
            .replace(/{LISTNAME}/g, list.name))
          .setDescription(bot.translate(bot, language, "listmanager.singlerandomize").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{LOADING}/g, bot.emoji.loading));
        let embedMessage;
        try {
          embedMessage = await message.channel.send(embed);
        } catch (e) {
          return bot.error(bot, message, language, e);
        }
        setTimeout(async () => {
          embed.setDescription(bot.translate(bot, language, "listmanager.randomizationsuccess").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.singlerandomize"))
            .replace(/{RANDOMIZED}/g, randomitem))
          embed.setColor(bot.colors.green)
          try {
            embedMessage.edit(embed);
          } catch (e) {
            return bot.error(bot, message, language, e);
          }
        }, 2000)
      } else {
        let randomcount = Math.abs(Math.floor(parseInt(args.pop())))
        let listname = args.slice(1).join(" ")
        if (!listnames.includes(listname.toLowerCase())) {
          let embed = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidlist").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, listname)
              .replace(/{LISTS}/g, listsarray.join("\n")));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase())
        if (!randomcount || randomcount < 2 || randomcount > list.items.length) {
          let embed = new Discord.MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "listmanager.invalidnumber").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{INPUT}/g, randomcount)
              .replace(/{MAX}/g, list.items.length));
          return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
        }
        let cooldown = guildData.randomizercooldown
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
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setFooter(bot.translate(bot, language, "listmanager.footer")
            .replace(/{LISTNAME}/g, list.name))
          .setDescription(bot.translate(bot, language, "listmanager.multirandomize").join("\n")
            .replace(/{COUNT}/g, randomcount)
            .replace(/{LOADING}/g, bot.emoji.loading));
        let embedMessage;
        try {
          embedMessage = await message.channel.send(embed)
        } catch (e) {
          return bot.error(bot, message, language, e);
        }
        setTimeout(async () => {
          embed.setDescription(bot.translate(bot, language, "listmanager.randomizationsuccess").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{USER}/g, message.author)
            .replace(/{FINALMESSAGE}/g, bot.translate(bot, language, "listmanager.multirandomize"))
            .replace(/{RANDOMIZED}/g, randomized.join("\n")));
          embed.setColor(bot.colors.green);
          try {
            embedMessage.edit(embed)
          } catch (e) {
            return bot.error(bot, message, language, e);
          }
        }, 2000)
      }
    } else if (subcommand === "create") {
      let lists = JSON.parse(guildData.listmanager);
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      })
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No List Provided**`,
            ``,
            `${bot.emoji.info} Please provide a list name.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (listname.length > 30) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **List Name Too Long**`,
            ``,
            `${bot.emoji.info} Please provide a name equal to or shorter than 30 characters.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (listnames.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **List Already Exists**`,
            ``,
            `${bot.emoji.info} List names are **not** case sensitive.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let date = new Date().toLocaleString("en")
      let listobject = {
        name: listname,
        creationdate: date,
        items: []
      }
      lists.push(listobject)
      bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id)
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([
          `${bot.emoji.check} **List Created**`,
          ``,
          `**Name:** ${listname}`,
          `**Creation Date:** ${date}`,
          ``,
          `${bot.emoji.info} To add items, type: \`${prefix}lm add\``])
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    } else if (subcommand === "delete") {
      let lists = JSON.parse(guildData.listmanager)
      let listname = args.slice(1).join(" ")
      let listnames = []
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase())
      })
      if (lists.length === 0) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No Lists Available**`,
            ``,
            `To create a list, type: \`${prefix}lm create\``])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let listcopy = []
      lists.forEach(l => {
        listcopy.push(l.name.toLowerCase());
      })
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**-** ${l.name}`);
      });
      let list = lists.find(l => l.name === listname.toLowerCase());
      if (!listcopy.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Invalid List Provided:** ${listname}`,
            ``,
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `${bot.emoji.info} To view items of a list, type: \`${prefix}lm view <list>\``])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
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
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription([
            `${bot.emoji.check} **List Deleted**`,
            ``,
            `**List:** ${list.name}`,
            `**Items:** ${haste}`])
        lists.splice(listcopy.indexOf(list.name), 1)
        bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }).catch(e => {
        return bot.error(bot, message, language, e);
      })
    } else if (subcommand === "bulkadd") {
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No Lists Available**`,
            ``,
            `To create a list, type: \`${prefix}lm create\``]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      })
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**-** ${l.name} (${l.items.length})`);
      });
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new Discord.MessageEmbed()
          .setAuthor(`List Manager - Bulk-Add Items`)
          .setColor(bot.colors.main)
          .setDescription([
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `${bot.emoji.info} To add an item, type the command again with a list.`]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (!listnames.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Invalid List:** ${listname}`,
            ``,
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `Please provide a list when typing the command again.`]);
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
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
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(`List Manager - Bulk-Add Items`)
          .setDescription([
            `**List:** ${list.name}`,
            ``,
            `**Current Items:** ${haste}`,
            ``,
            `Within **3** minutes, please provide all your items you wish to *add* to your list, separated by: \`|\``]);
        message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content
          message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ["time"] }).then(collected => {
            let items = collected.first().content.split("|");
            let cleanItems = items.map(i => i.trim()).filter(i => i.length >= 2);
            if (cleanItems < 2) {
              m.delete({ timeout: 500 }).catch(e => { });
              let error = new Discord.MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Please try again and provide at least 2 items separated by: \`|\`**`,
                  ``,
                  `${bot.emoji.info} **Example:** \`Item 1 | Item 2 | Item 3\``]);
              return message.channel.send(error).catch(e => { });
            }
            m.delete({ timeout: 500 }).catch(e => { });
            cleanItems.forEach(i => {
              list.items.push(i);
            })
            bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
            let embed = new Discord.MessageEmbed()
              .setColor(bot.colors.green)
              .setDescription([
                `${bot.emoji.check} **Bulk-Add Item Success**`,
                ``,
                `**List:** ${list.name}`,
                `**New Items:**`,
                `${list.items.map(i => `**-** ${i.trim()}`).join("\n")}`]);
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }).catch(collected => {
            let embed = new Discord.MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Bulk-Add Item Error**`,
                ``,
                `You did not provide any items, please try again.`]);
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          })
        }).catch(e => { });
      }).catch(e => {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Copy Error**`,
            ``,
            `A copy of your current items failed to be created. Please contact support if this error continues.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      });
    } else if (subcommand === "add") {
      let lists = JSON.parse(guildData.listmanager);
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let listsarray = [];
      lists.forEach(l => {
        listsarray.push(`**-** ${l.name} (${l.items.length})`)
      });
      if (lists.length === 0) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No Lists Available**`,
            ``,
            `${bot.emoji.info} To create a list, type: \`${prefix}lm create\``])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new Discord.MessageEmbed()
          .setAuthor(`List Manager - Add Items`)
          .setColor(bot.colors.main)
          .setDescription([
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `${bot.emoji.info} To add an item, type the command again with a list.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (!listnames.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Invalid List Provided:** ${listname}`,
            ``,
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `Please provide a list when typing the command again.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase())
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
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(`List Manager - Add Items`)
          .setDescription([
            `**List:** ${list.name}`,
            ``,
            `**Current Items:** ${haste}`,
            ``,
            `Within **60** seconds, please provide an item you wish to *add* to your list.`])
        message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content
          message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(collected => {
            let item = collected.first().content;
            list.items.push(item);
            bot.db.prepare("UPDATE guilddata SET listmanager=? WHERE guildid=?").run(JSON.stringify(lists), message.guild.id);
            bot.hastebin(list.items.map(i => i.trim()).join(" | "), { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **Item Added**`,
                  ``,
                  `**List:** ${list.name}`,
                  `**New Items:**`,
                  `${list.items.map(i => `**-** ${i.trim()}`).join("\n")}`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }).catch(e => {
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Copy Error**`,
                  ``,
                  `A copy of your new items failed to be created. Please contact support if this error continues.`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            })
          }).catch(collected => {
            let embed = new Discord.MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Add Item Error**`,
                ``,
                `You did not provide an item, please try again.`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          })
        }).catch(e => { });
      }).catch(e => {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Copy Error**`,
            ``,
            `A copy of your current items failed to be created. Please contact support if this error continues.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      });
    } else if (subcommand === "remove") {
      let lists = JSON.parse(guildData.listmanager)
      if (lists.length === 0) {
        let error = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No Lists Available**`,
            ``,
            `${bot.emoji.info} To create a list, type \`${prefix}lm create\``])
        return message.channel.send(error).catch(e => { });
      }
      let listnames = [];
      lists.forEach(l => {
        listnames.push(l.name.toLowerCase());
      });
      let listsarray = [];
      lists.forEach(list => {
        listsarray.push(`**-** ${list.name}`);
      });
      let listname = args.slice(1).join(" ")
      if (!listname) {
        let embed = new Discord.MessageEmbed()
          .setAuthor(`List Manager - Remove Items`)
          .setColor(bot.colors.main)
          .setDescription([
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `Please provide a list when typing the command again.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      if (!listnames.includes(listname.toLowerCase())) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Invalid List:** ${listname}`,
            ``,
            `**Available Lists:**`,
            `${listsarray.join("\n")}`,
            ``,
            `Please provide a list when typing the command again.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let list = lists.find(l => l.name.toLowerCase() === listname.toLowerCase())
      if (list.items.length === 0) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **No Items Available**`,
            ``,
            `**List:** ${list.name}`,
            ``,
            `Please add items to this list before removing them.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
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
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.lightgreen)
          .setAuthor(`List Manager - Bulk-Add Items`)
          .setDescription([
            `**List:** ${list.name}`,
            ``,
            `**Current Items:** ${haste}`,
            ``,
            `Within **30** seconds, please provide an item (not case sensitive) to remove.`])
        message.channel.send(embed).then(m => {
          const filter = m => m.author.id === message.author.id && message.content
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
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.green)
                  .setDescription([
                    `${bot.emoji.check} **All Items Removed**`,
                    ``,
                    `**List:** ${list.name}`,
                    `**Old Items:** ${haste}`])
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              }).catch(e => {
                let embed = new Discord.MessageEmbed()
                  .setColor(bot.colors.red)
                  .setDescription([
                    `${bot.emoji.cross} **Copy Error**`,
                    ``,
                    `A copy of your current items failed to be created. Please contact support if this error continues.`])
                return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
              });
              return;
            }
            let itemscopy = []
            list.items.forEach(i => {
              itemscopy.push(i.toLowerCase())
            })
            if (!itemscopy.includes(item.toLowerCase())) {
              m.delete({ timeout: 500 }).catch(e => { });
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Invalid Item Provided:** ${item}`,
                  ``,
                  `Please try again and provide a real item.`,
                  ``,
                  `${bot.emoji.info} To view items of a list, type: \`${prefix}lm view <list>\``])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }
            m.delete({ timeout: 500 }).catch(e => { });
            list.items.splice(itemscopy.indexOf(item.toLowerCase()), 1)
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
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.green)
                .setDescription([
                  `${bot.emoji.check} **Item Removed**`,
                  ``,
                  `**List:** ${list.name}`,
                  `**New Items:** ${haste}`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            }).catch(e => {
              console.log(e)
              let embed = new Discord.MessageEmbed()
                .setColor(bot.colors.red)
                .setDescription([
                  `${bot.emoji.cross} **Copy Error**`,
                  ``,
                  `A copy of your current items failed to be created. Please contact support if this error continues.`])
              return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
            })
          }).catch(collected => {
            let embed = new Discord.MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription([
                `${bot.emoji.cross} **Remove Item Error**`,
                ``,
                `You did not provide an item to remove, please try again.`])
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          })
        }).catch(e => { });
      }).catch(e => {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Copy Error**`,
            ``,
            `A copy of your current items failed to be created. Please contact support if this error continues.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      });
    } else if (subcommand === "cooldown") {
      if (!args[1] || isNaN(args[1])) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Please provide a number between \`5\` and \`300\` (seconds).**`,
            ``,
            `**Current Cooldown:** ${guildData.randomizercooldown}`,
            ``,
            `${bot.emoji.info} The number you select is the number of minutes until a user can use the randomizer.`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      let number = Math.abs(Math.floor(parseInt(args[1])))
      if (number > 300) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Please provide a number no greater than: \`300\`**`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else if (number < 5) {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription([
            `${bot.emoji.cross} **Please provide at least: \`5\`**`])
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
      bot.db.prepare("UPDATE guilddata SET randomizercooldown=? WHERE guildid=?").run(number, message.guild.id);
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([
          `${bot.emoji.check} **Custom List Randomize Cooldown Updated**`,
          ``,
          `**New Cooldown:** ${number} minutes`])
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    } else {
      if (message.member.hasPermission("MANAGE_GUILD")) {
        let embed = new Discord.MessageEmbed()
          .setAuthor(bot.translate(bot, language, "listmanager.helptitle")
            .replace(/{BOTNAME}/g, bot.user.username))
          .setColor(bot.colors.main)
          .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
          .setDescription(bot.translate(bot, language, "listmanager.help").join("\n")
            .replace(/{PREFIX}/g, prefix)
            .replace(/{INFO}/g, bot.emoji.info))
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      } else return;
    }
  }
}