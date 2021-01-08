const { MessageEmbed } = require("discord.js");
const helpid = "795759297622573077";
const testhelpid = "795840275653197874";
module.exports = {
  name: "INTERACTION_CREATE",
  run: async (bot, interaction) => {
    let choices = interaction.data.options;
    let guild = bot.guilds.cache.get(interaction.guild_id);
    let prefix = bot.prefixes.get(guild.id);
    let channel = guild.channels.cache.get(interaction.channel_id);
    let member = guild.members.cache.get(interaction.member.user.id) || await guild.members.fetch(interaction.member.user.id);
    let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
    if (!guildData) {
      bot.utils.registerGuild(bot, guild);
      guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
    }
    let language = bot.utils.getLanguage(bot, guildData.language)
    if ([helpid].includes(interaction.data.id)) {
      if (!choices) {
        if (!bot.helpmenus.get(guild.id)) {
          let tips = bot.translate(bot, language, "help.tips").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{GUIDE}/g, bot.docs.main)
            .replace(/{INVITE}/g, bot.invite)
            .replace(/{PREFIX}/g, prefix);
          let funarray = [];
          let infoarray = [];
          let gamesarray = [];
          let userarray = [];
          let utilsarray = [];
          let miscellaneousarray = [];
          let reactionarray = [];
          let minecraftarray = [];
          for (let c of bot.commands.array()) {
            if (!c.dev && c.category !== "ADMINISTRATOR") {
              let d = bot.disabledcommands.has(guild.id) && bot.disabledcommands.get(guild.id).includes(c.name) ? "!" : "";
              let category = c.category || "OTHERS";
              if (category === "ENTERTAINMENT") {
                funarray.push(`\`${d}${c.name}\``);
              } else if (category === "MINIGAMES") {
                gamesarray.push(`\`${d}${c.name}\``);
              } else if (category === "MINECRAFT") {
                minecraftarray.push(`\`${d}${c.name}\``);
              } else if (category === "REACTIONS") {
                reactionarray.push(`\`${d}${c.name}\``);
              } else if (category === "MISCELLANEOUS") {
                miscellaneousarray.push(`\`${d}${c.name}\``);
              } else if (category === "INFORMATION") {
                infoarray.push(`\`${d}${c.name}\``);
              } else if (category === "USER") {
                userarray.push(`\`${d}${c.name}\``);
              } else if (category === "UTILITIES") {
                utilsarray.push(`\`${d}${c.name}\``);
              }
            }
          }
          let disabledwarningmessage = bot.translate(bot, language, "help.hasdisabledcommands").replace(/{WARNING}/g, bot.emoji.warning).replace(/{GUILDNAME}/g, guild.name);
          let disabledwarning = bot.disabledcommands.has(guild.id) && bot.disabledcommands.get(guild.id).length > 0 ? disabledwarningmessage : "";
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "help.helpmenutitle").replace(/{GUILDNAME}/g, guild.name))
            .setColor(bot.colors.main)
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setDescription(tips)
            .addField(`🎉 ${bot.translate(bot, language, "help.category.entertainment")}`, funarray.join(" "), false)
            .addField(`🕹️ ${bot.translate(bot, language, "help.category.minigames")}`, gamesarray.join(" "), false)
            .addField(`${bot.emoji.minecraft} ${bot.translate(bot, language, "help.category.minecraft")}`, minecraftarray.join(" "), false)
            .addField(`😍 ${bot.translate(bot, language, "help.category.reactions")}`, reactionarray.join(" "), false)
            .addField(`🎀 ${bot.translate(bot, language, "help.category.miscellaneous")}`, miscellaneousarray.join(" "), false)
            .addField(`📚 ${bot.translate(bot, language, "help.category.information")}`, infoarray.join(" "), false)
            .addField(`👤 ${bot.translate(bot, language, "help.category.user")}`, userarray.join(" "), false)
            .addField(`⚙️ ${bot.translate(bot, language, "help.category.utilities")}`, utilsarray.join(" "), false)
            .addField(`\u200b`, bot.translate(bot, language, "help.bottom")
              .replace(/{INVITE}/g, bot.invite)
              .replace(/{HASDISABLED}/g, disabledwarning), false);
          bot.helpmenus.set(guild.id, embed);
        }
        if (!bot.adminmenus.get(guild.id)) {
          let tips = bot.translate(bot, language, "help.tips").join("\n")
            .replace(/{CHECK}/g, bot.emoji.check)
            .replace(/{GUIDE}/g, bot.docs.main)
            .replace(/{INVITE}/g, bot.invite)
            .replace(/{PREFIX}/g, prefix);
          let funarray = [];
          let infoarray = [];
          let gamesarray = [];
          let adminarray = [];
          let userarray = [];
          let utilsarray = [];
          let miscellaneousarray = [];
          let reactionarray = [];
          let minecraftarray = [];
          for (let c of bot.commands.array()) {
            if (!c.dev) {
              let d = bot.disabledcommands.has(guild.id) && bot.disabledcommands.get(guild.id).includes(c.name) ? "!" : "";
              let category = c.category || "OTHERS";
              if (category === "ENTERTAINMENT") {
                funarray.push(`\`${d}${c.name}\``);
              } else if (category === "MINIGAMES") {
                gamesarray.push(`\`${d}${c.name}\``);
              } else if (category === "MINECRAFT") {
                minecraftarray.push(`\`${d}${c.name}\``);
              } else if (category === "REACTIONS") {
                reactionarray.push(`\`${d}${c.name}\``);
              } else if (category === "MISCELLANEOUS") {
                miscellaneousarray.push(`\`${d}${c.name}\``);
              } else if (category === "INFORMATION") {
                infoarray.push(`\`${d}${c.name}\``);
              } else if (category === "USER") {
                userarray.push(`\`${d}${c.name}\``);
              } else if (category === "UTILITIES") {
                utilsarray.push(`\`${d}${c.name}\``);
              } else if (category === "ADMINISTRATOR") {
                adminarray.push(`\`${d}${c.name}\``);
              }
            }
          }
          let disabledwarningmessage = bot.translate(bot, language, "help.hasdisabledcommandsadmin").replace(/{WARNING}/g, bot.emoji.warning).replace(/{GUILDNAME}/g, guild.name).replace(/{PREFIX}/g, prefix);
          let disabledwarning = bot.disabledcommands.has(guild.id) && bot.disabledcommands.get(guild.id).length > 0 ? disabledwarningmessage : "";
          let embed = new MessageEmbed()
            .setAuthor(bot.translate(bot, language, "help.administratormenutitle").replace(/{GUILDNAME}/g, guild.name))
            .setColor(bot.colors.main)
            .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
            .setDescription(tips)
            .addField(`🎉 ${bot.translate(bot, language, "help.category.entertainment")}`, funarray.join(" "), false)
            .addField(`🕹️ ${bot.translate(bot, language, "help.category.minigames")}`, gamesarray.join(" "), false)
            .addField(`${bot.emoji.minecraft} ${bot.translate(bot, language, "help.category.minecraft")}`, minecraftarray.join(" "), false)
            .addField(`😍 ${bot.translate(bot, language, "help.category.reactions")}`, reactionarray.join(" "), false)
            .addField(`🎀 ${bot.translate(bot, language, "help.category.miscellaneous")}`, miscellaneousarray.join(" "), false)
            .addField(`📚 ${bot.translate(bot, language, "help.category.information")}`, infoarray.join(" "), false)
            .addField(`👤 ${bot.translate(bot, language, "help.category.user")}`, userarray.join(" "), false)
            .addField(`⚙️ ${bot.translate(bot, language, "help.category.utilities")}`, utilsarray.join(" "), false)
            .addField(`👮 ${bot.translate(bot, language, "help.category.administrator")}`, adminarray.join(" "), false)
            .addField(`\u200b`, bot.translate(bot, language, "help.adminbottom").join("\n")
              .replace(/{INFO}/g, bot.emoji.info)
              .replace(/{PREFIX}/g, prefix)
              .replace(/{INVITE}/g, bot.invite)
              .replace(/{HASDISABLED}/g, disabledwarning), false);
          bot.adminmenus.set(guild.id, embed);
        }
        let embedToSend = member.hasPermission("MANAGE_GUILD") ? bot.adminmenus.get(guild.id) : bot.helpmenus.get(guild.id);
        member.user.send(embedToSend).then(async m => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.green)
            .setDescription(bot.translate(bot, language, "help.sent").join("\n")
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{USER}/g, member.user)
              .replace(/{GUIDE}/g, bot.docs.main)
              .replace(/{INVITE}/g, bot.invite)
              .replace(/{MESSAGELINK}/g, m.url));
          try {
            await bot.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                type: 5
              }
            });
            return channel.send(embed);
          } catch (e) {
            console.error(e);
          }
        }).catch(async e => {
          let embed = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription(bot.translate(bot, language, "help.cannotsend").join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{USER}/g, member.user)
              .replace(/{GUIDE}/g, bot.docs.main)
              .replace(/{INVITE}/g, bot.invite));
          try {
            await bot.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                type: 5
              }
            });
            return channel.send(embed);
          } catch (e) {
            console.error(e);
          }
        });
      } else if (choices.length === 1) {
        let category = choices[0].value;
        try {
          await bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 5
            }
          });
          return channel.send(`**https://docs.magic8.xyz/v/${["en", "es", "fr"].includes(guildData.language) ? guildData.language : "en"}/commands/${category} **`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}