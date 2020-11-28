const Discord = require("discord.js");
const requestpromise = require("request-promise");
module.exports = {
  aliases: ["ow"],
  description: "View an Overwatch PC user's profile",
  emoji: "🎮",
  name: "overwatch",
  category: "MISCELLANEOUS",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let toSearch = args[0]
    if (!toSearch) {
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "overwatch.error.user").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{UESR}/g, message.author));
      return message.channel.send(error).catch(e => { });
    }
    let p
    try {
      let req = await requestpromise(`https://ow-api.com/v3/stats/pc/${toSearch.replace("#", "-")}/profile`);
      p = JSON.parse(req);
    } catch (e) {
      // console.error(e)
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "overwatch.error.unexpected").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{PREFIX}/g, prefix));
      return message.channel.send(error).catch(e => { });
    }
    let level = p.level;
    let prestige = p.prestige + "x";
    let totalLevel = (p.prestige * 100) + level;
    let endorse = p.endorsement;
    let icon = p.icon;
    if (p.private === true) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.main)
        .setThumbnail(icon)
        .setAuthor(bot.translate(bot, language, "overwatch.success.title").replace(/{TOSEARCH}/g, toSearch))
        .setDescription(bot.translate(bot, language, "overwatch.success.privatedescription").join("\n")
          .replace(/{TOTALLEVEL}/g, totalLevel)
          .replace(/{CURRENTLEVEL}/g, level)
          .replace(/{PRESTIGE}/g, prestige)
          .replace(/{ENDORSELEVEL}/g, endorse));
      return message.channel.send(embed).catch(e => { });
    } else {
      let ranked = p.ratings;
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

      let slevel
      let sicon
      try {
        let support = ranked.support;
        if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-BronzeTier.png") {
          sicon = bot.emoji.bronze
        } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-SilverTier.png") {
          sicon = bot.emoji.silver
        } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-GoldTier.png") {
          sicon = bot.emoji.gold
        } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png") {
          sicon = bot.emoji.plat
        } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png") {
          sicon = bot.emoji.diamond
        } else if (support.rankIcon === "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-MasterTier.png") {
          sicon = bot.emoji.master
        }
        slevel = support.level;
      } catch (e) {
        sicon = "";
        slevel = "N/A";
      }
      let rankedgames = p.competitiveStats.games;
      let rankedwins = rankedgames.won;
      let rankedlosses = rankedgames.played - rankedwins;
      let rankedwinpercentage = ((rankedwins / rankedgames.played) * 100).toFixed();
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.main)
        .setThumbnail(icon)
        .setAuthor(bot.translate(bot, language, "overwatch.success.title")
          .replace(/{TOSEARCH}/g, toSearch))
        .setDescription(bot.translate(bot, language, "overwatch.success.publicdescription").join("\n")
          .replace(/{TOTALLEVEL}/g, totalLevel)
          .replace(/{CURRENTLEVEL}/g, level)
          .replace(/{PRESTIGE}/g, prestige)
          .replace(/{ENDORSELEVEL}/g, endorse)
          .replace(/{CARDS}/g, p.quickPlayStats.awards.cards)
          .replace(/{BRONZE}/g, p.quickPlayStats.awards.medalsBronze)
          .replace(/{SILVER}/g, p.quickPlayStats.awards.medalsSilver)
          .replace(/{GOLD}/g, p.quickPlayStats.awards.medalsGold)
          .replace(/{WON}/g, p.quickPlayStats.games.won)
          .replace(/{AVERAGE}/g, p.rating)
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
          .replace(/{SUPPORTICON}/g, sicon))
      return message.channel.send(embed).catch(e => { })
    }
  }
}