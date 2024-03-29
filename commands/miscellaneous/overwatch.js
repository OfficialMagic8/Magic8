const { MessageEmbed } = require("discord.js");
const heroes = ["bastion", "dVa", "genji", "hanzo", "junkrat", "lucio", "mccree", "mei", "mercy", "orisa", "pharah", "reaper", "reinhardt", "roadhog", "soldier76", "sombra", "symmetra", "torbjorn", "tracer", "widowmaker", "winston", "zarya", "zenyatta"]
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
          .replace(/{USER}/g, message.author));
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
          .replace(/{TOTALLEVEL}/g, totalLevel.toLocaleString("en"))
          .replace(/{CURRENTLEVEL}/g, level.toLocaleString("en"))
          .replace(/{PRESTIGE}/g, prestige.toLocaleString("en"))
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
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-MasterTier.png") {
            ticon = bot.emoji.master;
          } else if (tank.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GrandmasterTier.png") {
            ticon = bot.emoji.grandmaster;
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
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-MasterTier.png") {
            dicon = bot.emoji.master;
          } else if (dps.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GrandmasterTier.png") {
            dicon = bot.emoji.grandmaster;
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
          } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GrandmasterTier.png") {
            sicon = bot.emoji.grandmaster;
          }
          slevel = support.level;
        } catch (e) {
          sicon = "";
          slevel = "N/A";
        }
        let averageicon;
        if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png") {
          averageicon = bot.emoji.bronze;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-SilverTier.png") {
          averageicon = bot.emoji.silver;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GoldTier.png") {
          averageicon = bot.emoji.gold;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png") {
          averageicon = bot.emoji.plat;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png") {
          averageicon = bot.emoji.diamond;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-MasterTier.png") {
          averageicon = bot.emoji.master;
        } else if (json.ratingIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GrandmasterTier.png") {
          averageicon = bot.emoji.grandmaster;
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
          .replace(/{TOTALLEVEL}/g, totalLevel.toLocaleString("en"))
          .replace(/{CURRENTLEVEL}/g, level.toLocaleString("en"))
          .replace(/{PRESTIGE}/g, prestige)
          .replace(/{ENDORSELEVEL}/g, endorse)
          .replace(/{CARDS}/g, json.quickPlayStats.awards.cards.toLocaleString("en"))
          .replace(/{BRONZE}/g, json.quickPlayStats.awards.medalsBronze.toLocaleString("en"))
          .replace(/{SILVER}/g, json.quickPlayStats.awards.medalsSilver.toLocaleString("en"))
          .replace(/{GOLD}/g, json.quickPlayStats.awards.medalsGold.toLocaleString("en"))
          .replace(/{WON}/g, json.quickPlayStats.games.won.toLocaleString("en"))
          .replace(/{AVERAGE}/g, json.rating)
          .replace(/{AVERAGEICON}/g, averageicon)
          .replace(/{TANK}/g, bot.emoji.tank)
          .replace(/{DPS}/g, bot.emoji.dps)
          .replace(/{SUPPORT}/g, bot.emoji.support)
          .replace(/{RANKEDWINS}/g, rankedwins.toLocaleString("en"))
          .replace(/{RANKEDLOSSES}/g, rankedlosses.toLocaleString("en"))
          .replace(/{RANKEDPERCENTAGE}/g, rankedwinpercentage.toLocaleString("en"))
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
    });
  }
}