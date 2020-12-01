const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["cas"],
  description: "Magic8's asino!",
  emoji: ":game_die:",
  name: "casino",
  ignore: true,
  dev: true,
  category: "CASINO",
  run: async (bot, message, args, prefix, guildData, log) => {
    //message.delete({timeout:500}).catch(e=>{});
    if (!bot.playingcasino.has(message.author.id) && message.author.presence.status === "offline") {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **${message.author}, to enter the casino, you cannot have an \`offline\` status!**`)
      return message.channel.send(error).catch(e => { })
    } else if (!bot.playingcasino.has(message.author.id) && !bot.welcomecasino.has(message.author.id)) {
      bot.welcomecasino.set(message.author.id)
      let welcomeEmbed = new MessageEmbed()
        .setColor(bot.colors.main)
        // .setImage("https://us.123rf.com/450wm/welcomia/welcomia1709/welcomia170900155/86957180-stock-illustration-dark-purple-casino-games-3d-rendered-illustration-concept-vegas-online-casino-games-conceptual-graph.jpg?ver=6")
        .setDescription([`**Welcome to the Magic8 Casino, ${message.author}!**`,
          ``,
        `To enter the casino, please click ${bot.emoji.check} below.`,
          ``,
        `*${bot.emoji.info} The casino will charge you **90%** of your money if you go offline and will kick you. The casino also briefly closes at *3 AM (EST)* every day.*`].join("\n"))
      let welcomeMessage;
      try {
        welcomeMessage = await message.channel.send(welcomeEmbed)
      } catch (e) {
        log.error(e)
        // bot.welcomecasino.delete(message.author.id)
        let error = new MessageEmbed()
          .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you into the casino!**`)
          .setColor(bot.colors.red)
          .setFooter(bot.footer)
        return message.channel.send(error).catch(e => { })
      }
      setTimeout(async () => {
        welcomeMessage.react((bot.emoji.check).replace(">", "")).catch(e => {
          let error = new MessageEmbed()
            .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you into the casino!**`)
            .setColor(bot.colors.red)
            .setFooter(bot.footer)
          return message.channel.send(error).catch(e => { })
        });
        let filter = (reaction, user) => !user.bot && user.id === message.author.id && user.status !== "offline" && reaction.emoji.id === "693828165172461638"
        let collected;
        collected = await welcomeMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ["time"] })
          .then(async collected => {
            if (message.author.presence.status === "offline") {
              welcomeEmbed.setColor(bot.colors.red)
                .setDescription(`${bot.emoji.cross} **${message.author}, please do not have an \`offline\` status when entering or inside the casino!**`)
              bot.welcomecasino.delete(message.author.id)
              try {
                await welcomeMessage.edit(welcomeEmbed)
                await welcomeMessage.reactions.removeAll().catch(e => { });
              } catch (e) {
                log.error(e)
                let error = new MessageEmbed()
                  .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you into the casino! Please do not have an \`offline\` status!**`)
                  .setColor(bot.colors.red)
                  .setFooter(bot.footer)
                return message.channel.send(error).catch(e => { })
              }
            } else {
              bot.welcomecasino.delete(message.author.id)
              bot.playingcasino.set(message.author.id)
              let user = message.author
              let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
              let joinTitle;
              let joinDescription;
              if (!userData) {
                // log.info(`🎲 ${message.author.tag} joined the Casino for the first time`)
                bot.utils.registerUser(bot, user);
                userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
                bot.database.prepare("UPDATE usersinfo SET coins=?,casinoguildid=?,casinochannelid=? WHERE userid=?").run(1000, message.guild.id, message.channel.id, message.author.id);
                joinDescription = [
                  `${bot.emoji.check} **${message.author} entered the casino for the first time! Please consider typing** \`${prefix}casino\` **to view the Casino Help Menu!**`,
                  ``,
                  `**__Starting Info__**`,
                  `**Coins:** ${(1000 * userData.multiplier).toLocaleString("en")}`,
                  `**Multiplier:** ${userData.multiplier}`,
                  `**Channel:** ${message.channel}`,
                  ``,
                  `*Have a wonderful time here! Exit whenever by using \`${prefix}casino exit\`*`
                ]
              } else {
                bot.database.prepare("UPDATE usersinfo SET casinoguildid=?,casinochannelid=? WHERE userid=?").run(message.guild.id, message.channel.id, message.author.id);
                // log.info(`🎲 ${message.author.tag} joined the Casino`)
                joinDescription = [
                  `${bot.emoji.check} **Welcome back to the Casino, ${message.author}! Please type ** \`${prefix}casino\` ** to view the Casino Help Menu!**`,
                  ``,
                  `**__Money__**`,
                  `**Coins:** ${(userData.coins * userData.multiplier).toLocaleString("en")}`,
                  `**Multiplier:** ${userData.multiplier}`,
                  `**Channel:** ${message.channel}`,
                  ``,
                  `*Have a wonderful time back here! Exit whenever by using \`${prefix}casino exit\`*`
                ]
              }
              welcomeEmbed.setColor(bot.colors.green)
                // .setAuthor(joinTitle,message.author.displayAvatarURL({format:"png",dynamic:"true"}))
                .setDescription(joinDescription.join("\n"))
              try {
                await welcomeMessage.edit(welcomeEmbed)
                await welcomeMessage.reactions.removeAll().catch(e => { });
              } catch (e) {
                log.error(e)
                // log.info(`🎲 ${message.author.tag} did not join the Casino`)
                bot.playingcasino.delete(message.author.id);
                let error = new MessageEmbed()
                  .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you into the casino!**`)
                  .setColor(bot.colors.red)
                  .setFooter(bot.footer)
                return message.channel.send(error).catch(e => { })
              }
            }
          }).catch(async collected => {
            // console.error(error)
            // log.error(error)
            // log.info(`🎲 ${message.author.tag} did not join the Casino`)
            bot.welcomecasino.delete(message.author.id)
            let errorDescription = [
              `${bot.emoji.cross} **${message.author}, you were not let into the casino! Please make sure you're online!**`,
              ``,
              `*Re-enter the casino:* \`${prefix}casino\``
            ]
            welcomeEmbed.setDescription(errorDescription.join("\n"))
              .setAuthor("")
              .setImage()
              .setColor(bot.colors.red)
            try {
              await welcomeMessage.reactions.removeAll().catch(e => { });
              await welcomeMessage.edit(welcomeEmbed).catch(e => { })
              await welcomeMessage.delete({ timeout: 15000 }).catch(e => { })
            } catch (e) {
              bot.playingcasino.delete(message.author.id)
              log.error(e)
              let error = new MessageEmbed()
                .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you into the casino!**`)
                .setColor(bot.colors.red)
                .setFooter(bot.footer)
              return message.channel.send(error).catch(e => { })
            }
          });
      }, 1000)
    } else if (bot.playingcasino.has(message.author.id)) {
      let helpmenudescription = [
        `**__User Commands__**`,
        ``,
        `*Some commands require a small fee!*`,
        `\`${prefix}bal\` - Check Your Balance and Multiplier. (\\💰**FREE**)`,
        `\`${prefix}rob\` - Attempt to Rob Another Casino Member (\\💰**200**).`,
        `\`${prefix}casino exit\` - Get Escorted from the Casino (\\💰**-50%**).`,
        `\`${prefix}casino games\` - Ask a Casino Staff Member for the Game Menu. (\\💰**FREE**)`,
        `\`${prefix}casino list\` - Ask a Casino Staff Member to List Casino Members (\\💰**50**).`,
        ``,
        `**__Admin Commands__**`,
        `\`${prefix}casino addbal\` Add Coins to a User's Balance`,
        `\`${prefix}casino setbal\` Set a User's Coin Balance`,
        `\`${prefix}casino subbal\` Subtract Coins from a User's Balance.`]
      if (!args[0]) {
        let helpMenu = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(`Casino Help Menu`)
          .setDescription(helpmenudescription.join("\n"))
        return message.channel.send(helpMenu).catch(e => { })
      }
      let subcommand = args[0].toLowerCase()
      if (["leave", "exit"].includes(subcommand)) {
        let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
        let exitEmbed = new MessageEmbed()
          .setColor(bot.colors.lightred)
          .setDescription([`${bot.emoji.warning} **${message.author}, you're about to leave the casino!**`,
            ``,
            `**__Some information we summarized for you:__**`,
          `**Coins:** ${userData.coins.toLocaleString("en")}`,
          `**Multiplier:** ${userData.multiplier}`,
          `**Total:** ${(userData.coins * userData.multiplier).toLocaleString("en")}`,
            ``,
          `For next time you join, you will have \\💰**${(Math.floor((userData.coins * userData.multiplier) / 2)).toLocaleString("en")}** coins!`,
            ``,
            `We hope you enjoyed your time here! Come back soon!`,
            `*React with ✅ (within **10** seconds) to confirm your decision.*`].join("\n"))
        let exitMessage;
        try {
          exitMessage = await message.channel.send(exitEmbed)
        } catch (e) {
          bot.playingcasino.delete(message.author.id);;
          let error = new MessageEmbed()
            .setDescription(`${bot.emoji.cross} **${message.author}, there was an error escorting you out of the casino!**`)
            .setColor(bot.colors.red)
            .setFooter(bot.footer)
          return message.channel.send(error).catch(e => { })
        }
        setTimeout(async () => {
          exitMessage.react("✅").catch(e => {
            log.error(e)
            let error = new MessageEmbed()
              .setDescription(`${bot.emoji.cross} **${message.author}, there was an error escorting you out of the casino!**`)
              .setColor(bot.colors.red)
              .setFooter(bot.footer)
            return message.channel.send(error).catch(e => { })
          });
          let filter = (reaction, user) => !user.bot && user.id === message.author.id && reaction.emoji.name === "✅"
          let collected;
          collected = await exitMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
            .then(async collected => {
              // log.info(`🎲 ${message.author.tag} left the Casino via command`)
              let leaveDescription = [
                `${bot.emoji.check} **${message.author}, you have been escorted out of the casino!**`,
                `For when you want to come back: \`${prefix}casino\``
              ]
              bot.database.prepare("UPDATE usersinfo SET coins=?,casinoguildid=?,casinochannelid=? WHERE userid=?").run((Math.floor((userData.coins * userData.multiplier) / 2)).toLocaleString("en"), "none", "none", message.author.id);
              exitEmbed.setDescription(leaveDescription.join("\n"))
                .setColor(bot.colors.green)
              bot.playingcasino.delete(message.author.id);
              try {
                await exitMessage.reactions.removeAll().catch(e => { });
                await exitMessage.edit(exitEmbed).catch(e => { })
                await exitMessage.delete({ timeout: 15000 }).catch(e => { })
              } catch (e) {
                let error = new MessageEmbed()
                  .setDescription(`${bot.emoji.cross} **${message.author}, there was an error escorting you out of the casino!**`)
                  .setColor(bot.colors.red)
                  .setFooter(bot.footer)
                return message.channel.send(error).catch(e => { })
              }
            }).catch(async collected => {
              let didNotLeaveDescription = `${bot.emoji.cross} **${message.author}, you were not escorted out of the casino!**`
              exitEmbed.setDescription(didNotLeaveDescription)
                .setColor(bot.colors.red)
              try {
                await exitMessage.reactions.removeAll().catch(e => { });
                await exitMessage.edit(exitEmbed).catch(e => { })
                await exitMessage.delete({ timeout: 15000 }).catch(e => { })
              } catch (e) {
                let error = new MessageEmbed()
                  .setDescription(`${bot.emoji.cross} **${message.author}, there was an error escorting you out of the casino!**`)
                  .setColor(bot.colors.red)
                  .setFooter(bot.footer)
                return message.channel.send(error).catch(e => { })
              }
            });
        }, 1000)
      } else if (subcommand === "games") {
        let gamesEmbed = new MessageEmbed()
          .setColor(bot.colors.main)
          .setDescription([`**__Casino Game Menu__**`,
            `\`${prefix}bj\` - Black Jack (\\💰**50**)`,
            `\`${prefix}nb\` - Number Bets (\\💰**FREE**)`,
            `\`${prefix}rtd\` - Roll the Dice (\\💰**FREE**)`,
            `\`${prefix}slot\` - Slot Machine (\\💰**50**)`,
            ``,
            `*Open the help menu for these games by typing* \`${prefix}cas <game>\``].join("\n"))
        return message.channel.send(gamesEmbed).catch(e => { })
      } else if (subcommand === "list") {
        // log.info(`🎲 ${message.author.tag} opened the Casino Member List`)
        if (message.member.hasPermission("ADMINISTRATOR")) {
          let userArray = []
          let users = bot.users.cache.keyArray()
          for (let user of users) {
            let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(user);
            if (userData) {
              userArray.push(`**${bot.users.cache.get(user)}** - ${userData.coins.toLocaleString("en")} - ${userData.multiplier} - ${userData.stealingrisk}%`)
            }
          }
          let listEmbed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
            .setDescription(`**Casino Members in ${message.guild.name}**\n\n__Name - Coins - Multiplier - Stealing Risk__\n${userArray.join("\n")}`)
          return message.channel.send(listEmbed).catch(e => { })
        } else {
          let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
          bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins - 50, message.author.id);
          let userArray = []
          let users = bot.users.cache.keyArray()
          for (let user of users) {
            let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(user);
            if (userData) {
              userArray.push(`**${bot.users.cache.get(user)}** - ${userData.coins.toLocaleString("en")}`)
            }
          }
          let listEmbed = new MessageEmbed()
            .setColor(bot.colors.main)
            .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
            .setDescription(`**Casino Members in ${message.guild.name}**\n\n__Name - Coins__\n${userArray.join("\n")}`)
          return message.channel.send(listEmbed).catch(e => { })
        }
      } else if (subcommand === "setbal" && message.member.hasPermission("ADMINISTRATOR")) {
        let target;
        if (args[1]) {
          let id = args[1].replace(/[^0-9]/g, "");
          try {
            target = bot.users.cache.get(id);
          } catch (e) {
            let error = new MessageEmbed()
              .setColor(bot.colors.lightred)
              .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid user or ID that has registered in the casino and then provide a value of coins to add!**`,
              `To view a list of users registered in the casino, type: \`${prefix}casino list\``].join("\n"))
            return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
          }
        }
        if (!target.user || !bot.playingcasino.has(target.id)) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, to set someone's balance, please provide a valid user or ID that has registered in the casino and then provide a value of coins to add!**`,
            `To view a list of users in the casino, type: \`${prefix}casino list\``].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        if (!args[2] || isNaN(args[2])) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid amount of coins to set for ${target}'s balance!**`].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        let setValue = parseInt(Math.abs(args[2]))
        bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(setValue, target.id);
        let success = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(`${bot.emoji.check} **${message.author}, you successfully set ${target}'s balance to 💰${setValue.toLocaleString("en")}!**`)
        return message.channel.send(success).catch(e => { })
      } else if (subcommand === "addbal" && message.member.hasPermission("ADMINISTRATOR")) {
        let target;
        if (args[1]) {
          let id = args[1].replace(/[^0-9]/g, "");
          try {
            target = bot.users.cache.get(id);
          } catch (e) {
            let error = new MessageEmbed()
              .setColor(bot.colors.lightred)
              .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid user or ID that has registered in the casino and then provide a value of coins to add!**`,
              `To view a list of users registered in the casino, type: \`${prefix}casino list\``].join("\n"))
            return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
          }
        }
        if (!target.user || !bot.playingcasino.has(target.id)) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, to set someone's balance, please provide a valid user or ID that has registered in the casino and then provide a value of coins to add!**`,
            `To view a list of users in the casino, type: \`${prefix}casino list\``].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        if (!args[2] || isNaN(args[2])) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid amount of coins to add to ${target}'s balance!**`].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
        let setValue = parseInt(Math.abs(args[2]))
        bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins + setValue, target.id);
        let success = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(`${bot.emoji.check} **${message.author}, you successfully added 💰${setValue.toLocaleString("en")} for a total of 💰${(userData.coins + setValue).toLocaleString("en")} to ${target}'s balance!**`)
        return message.channel.send(success).catch(e => { })
      } else if (subcommand === "subbal" && message.member.hasPermission("ADMINISTRATOR")) {
        let target;
        if (args[1]) {
          let id = args[1].replace(/[^0-9]/g, "");
          try {
            target = bot.users.cache.get(id);
          } catch (e) {
            let error = new MessageEmbed()
              .setColor(bot.colors.lightred)
              .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid user or ID that has registered in the casino and then provide a value of coins to subtract!**`,
              `To view a list of users registered in the casino, type: \`${prefix}casino list\``].join("\n"))
            return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
          }
        }
        if (!target.user) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, to set someone's balance, please provide a valid user or ID that has registered in the casino and then provide a value of coins to subtract!**`,
            `To view a list of users in the casino, type: \`${prefix}casino list\``].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        if (!args[2] || isNaN(args[2])) {
          let error = new MessageEmbed()
            .setColor(bot.colors.lightred)
            .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid amount of coins to subtract from ${target}'s balance!**`].join("\n"))
          return message.channel.send(error).catch(e => { }).then(m => m.delete({ timeout: 15000 }).catch(e => { }));
        }
        let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
        let setValue = parseInt(Math.abs(args[2]))
        bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins - setValue, target.id);
        let success = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(`${bot.emoji.check} **${message.author}, you successfully subtracted 💰${setValue.toLocaleString("en")} for a total of 💰${(userData.coins - setValue).toLocaleString("en")} from ${target}'s balance!**`)
        message.channel.send(success).catch(e => { })
      } else {
        let helpMenu = new MessageEmbed()
          .setColor(bot.colors.main)
          .setAuthor(`Casino Help Menu`)
          .setDescription(helpmenudescription.join("\n"))
        return message.channel.send(helpMenu).catch(e => { })
      }
    }
  }
}