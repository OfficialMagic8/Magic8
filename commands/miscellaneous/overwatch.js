const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["ow"],
  description: "View an Overwatch PC user's profile",
  emoji: "🎮",
  name: "overwatch",
  category: "MISCELLANEOUS",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let toSearch = args[0];
    if (!toSearch) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "overwatch.error.user").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{UESR}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    let embed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(bot.translate(bot, language, "overwatch.fetching")
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{TOSEARCH}/g, toSearch))
    let embedmessage = await message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    bot.fetch(`https://ow-api.com/v3/stats/pc/${toSearch.replace("#", "-")}/profile`).then(res => res.json()).then(json => {
      let level = json.level;
      let prestige = json.prestige + "x";
      let totalLevel = (json.prestige * 100) + level;
      let endorse = json.endorsement;
      let icon = json.icon;
      if (json.private === true) {
        embed.setColor(bot.colors.main)
        embed.setThumbnail(icon)
        embed.setAuthor(bot.translate(bot, language, "overwatch.success.title")
          .replace(/{TOSEARCH}/g, toSearch))
        embed.setDescription(bot.translate(bot, language, "overwatch.success.privatedescription").join("\n")
          .replace(/{TOTALLEVEL}/g, totalLevel)
          .replace(/{CURRENTLEVEL}/g, level)
          .replace(/{PRESTIGE}/g, prestige)
          .replace(/{ENDORSELEVEL}/g, endorse));
        return embedmessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
      } else {
        let ranked = json.ratings;
        let ticon;
        let tlevel;
        try {
          let tank = ranked.tank;
          if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png") {
            ticon = bot.emoji.bronze;
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-SilverTier.png") {
            ticon = bot.emoji.silver;
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GoldTier.png") {
            ticon = bot.emoji.gold;
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png") {
            ticon = bot.emoji.plat;
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png") {
            ticon = bot.emoji.diamond;
          }
          tlevel = tank.level;
        } catch (e) {
          ticon = "";
          tlevel = "N/A";
        }
        let dlevel;
        let dicon;
        try {
          let dps = ranked.damage;
          if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png") {
            dicon = bot.emoji.bronze;
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-SilverTier.png") {
            dicon = bot.emoji.silver;
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GoldTier.png") {
            dicon = bot.emoji.gold;
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png") {
            dicon = bot.emoji.plat;
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png") {
            dicon = bot.emoji.diamond;
          }
          dlevel = dps.level;
        } catch (e) {
          dicon = "";
          dlevel = "N/A";
        }

        let slevel;
        let sicon;
        try {
          let support = ranked.support;
          if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png") {
            sicon = bot.emoji.bronze;
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-SilverTier.png") {
            sicon = bot.emoji.silver;
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GoldTier.png") {
            sicon = bot.emoji.gold;
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png") {
            sicon = bot.emoji.plat;
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png") {
            sicon = bot.emoji.diamond;
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-MasterTier.png") {
            sicon = bot.emoji.master;
          }
          slevel = support.level;
        } catch (e) {
          sicon = "";
          slevel = "N/A";
        }
        let rankedgames = json.competitiveStats.games;
        let rankedwins = rankedgames.won;
        let rankedlosses = rankedgames.played - rankedwins;
        let rankedwinpercentage = ((rankedwins / rankedgames.played) * 100).toFixed();
        embed.setColor(bot.colors.main)
        embed.setThumbnail(icon)
        embed.setAuthor(bot.translate(bot, language, "overwatch.success.title")
          .replace(/{TOSEARCH}/g, toSearch))
        embed.setDescription(bot.translate(bot, language, "overwatch.success.publicdescription").join("\n")
          .replace(/{TOTALLEVEL}/g, totalLevel)
          .replace(/{CURRENTLEVEL}/g, level)
          .replace(/{PRESTIGE}/g, prestige)
          .replace(/{ENDORSELEVEL}/g, endorse)
          .replace(/{CARDS}/g, json.quickPlayStats.awards.cards)
          .replace(/{BRONZE}/g, json.quickPlayStats.awards.medalsBronze)
          .replace(/{SILVER}/g, json.quickPlayStats.awards.medalsSilver)
          .replace(/{GOLD}/g, json.quickPlayStats.awards.medalsGold)
          .replace(/{WON}/g, json.quickPlayStats.games.won)
          .replace(/{AVERAGE}/g, json.rating)
          .replace(/{TANK}/g, bot.emoji.tank)
          .replace(/{DPS}/g, bot.emoji.dps)
          .replace(/{SUPPORT}/g, bot.emoji.support)
          .replace(/{RANKEDWINS}/g, rankedwins)
          .replace(/{RANKEDLOSSES}/g, rankedlosses)
          .replace(/{RANKEDPERCENTAGE}/g, rankedwinpercentage)
          .replace(/{TANKLVL}/g, tlevel)
          .replace(/{DPSLVL}/g, dlevel)
          .replace(/{SUPPORTLVL}/g, slevel)
          .replace(/{TANKICON}/g, ticon)
          .replace(/{DPSICON}/g, dicon)
          .replace(/{SUPPORTICON}/g, sicon));
        return embedmessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
      }
    }).catch(e => {
      embed.setColor(bot.colors.red)
      embed.setDescription(bot.translate(bot, language, "overwatch.error.unexpected").join("\n")
        .replace(/{CROSS}/g, bot.emoji.cross)
        .replace(/{PREFIX}/g, prefix));
      return embedmessage.edit(embed).catch(e => { return bot.error(bot, message, language, e); });
    })
  }
}