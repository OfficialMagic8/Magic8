const Discord = require("discord.js");
const requestpromise = require("request-promise");
const bodyURL = "https://minotar.net/armor/body/{USER}/300.png";
const headURL = "https://minotar.net/cube/{USER}/100.png";
const helmURL = "https://minotar.net/helm/{USER}/100.png";
const profileURL = "https://es.namemc.com/profile/{USER}";
module.exports = {
  aliases: ["hipixel", "hyp", "jaipixel"],
  category: "MINECRAFT",
  description: "Get a Hypixel player's statistics",
  emoji: "🎮",
  name: "hypixel",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let toSearch = args[0];
    if (!toSearch) {
      let embed = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.translate(bot, language, "hypixel.error.invalid")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author));
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
    }
    let parsed;
    try {
      let requested = await requestpromise(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_TOKEN}&name=${toSearch}`);
      parsed = JSON.parse(requested);
      if (parsed.success) {
        if (parsed.player === null) {
          let matchRegex = toSearch.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi)
          if (matchRegex && matchRegex.length !== 0) {
            requested = await requestpromise(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_TOKEN}&uuid=${toSearch}`);
            parsed = JSON.parse(requested);
          } else {
            let embed = new Discord.MessageEmbed()
              .setColor(bot.colors.red)
              .setDescription(bot.translate(bot, language, "hypixel.error.neverjoined")
                .replace(/{CROSS}/g, bot.emoji.cross)
                .replace(/{USER}/g, message.author));
            return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
          }
        }
      } else {
        let embed = new Discord.MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.translate(bot, language, "hypixel.error.invalid")
            .replace(/{CROSS}/g, bot.emoji.cross)
            .replace(/{USER}/g, message.author));
        return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e) });
      }
    } catch (e) {
      console.error(e);
      bot.error(bot, message, language, e)
    }
    let player = parsed.player;
    let firstLogin = new Date(player.firstLogin);
    let lastLogin = new Date(player.lastLogin);
    let lastLogout = new Date(player.lastLogout);
    let karma = player.karma || 0;
    let networkExp = player.networkExp || 0;
    let rank = getRank(player.rank ? player.rank : (player.newPackageRank ? player.newPackageRank : (player.packageRank ? player.packageRank : "User")));
    let subscription = player.monthlyPackageRank ? (player.monthlyPackageRank === "NONE" ? "None" : player.monthlyPackageRank) : "None";
    let rewardStreak = player.rewardStreak ? player.rewardStreak : 0;
    let achievementPoints = player.achievementPoints ? player.achievementPoints : 0;
    let userLanguage = player.userLanguage ? (`${player.userLanguage.substring(0, 1)}${player.userLanguage.slice(1).toLowerCase()}`) : "Unknown";
    let socialMedia = []
    if (player.socialMedia && player.socialMedia.links) {
      let keys = Object.keys(player.socialMedia.links);
      for (let key of keys) {
        socialMedia.push(`[${key.substring(0, 1)}${key.slice(1).toLowerCase()}](${player.socialMedia.links[key]})`);
      }
    }
    let a1 = (5000 * networkExp) + 76562500;
    let a2 = Math.sqrt(a1);
    let a3 = a2 - 6250;
    let a4 = a2 + 6250;
    let a5 = a3 / 2500;
    let a6 = a4 / 2500;
    let networklevel;
    if (a5 > 0 && a6 > 0) {
      networklevel = Math.min(a5, a6);
    } else {
      networklevel = Math.max(a5, a6)
    }
    networklevel = Math.floor(networklevel);
    let status = "Unknown";
    let uuid = bot.utils.UUIDfromString(player.uuid);
    try {
      let statusres = JSON.parse(await requestpromise(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_TOKEN}&uuid=${uuid}`));
      if (statusres.success) {
        if (statusres.session.online) {
          status = `\\🟢${bot.translate(bot, language, "hypixel.success.online").join("\n")
            .replace(/{GAMEMODE}/g, statusres.session.gameType)}`;
        } else {
          status = "\\🔴";
        }
      }
    } catch (e) { }
    let hypixel = "https://avatars0.githubusercontent.com/u/3840546?s=200&v=4";
    let rewardHighScore = player.rewardHighScore ? player.rewardHighScore : 0;
    // let rankPlusColor = player.rankPlusColor ? `${player.rankPlusColor.substring(0, 1)}${player.rankPlusColor.slice(1).toLowerCase()}`.replace(/_/g, " ") : "None"
    // let mostRecentGameType = player.mostRecentGameType ? `${player.mostRecentGameType.substring(0, 1)}${player.mostRecentGameType.slice(1).toLowerCase()}` : "Unknown"
    let hypixelstats = new Discord.MessageEmbed()
      .setColor(bot.colors.yellow)
      .setAuthor(bot.translate(bot, language, "hypixel.success.title")
        .replace(/{TARGET}/g, player.displayname), hypixel)
      .setThumbnail(headURL.replace(/{USER}/g, player.uuid))
      .setFooter(bot.footer)
      .setDescription(bot.translate(bot, language, "hypixel.success.description").join("\n")
        .replace(/{DISPLAYNAME}/g, player.displayname)
        .replace(/{RANK}/g, rank)
        .replace(/{SUBSCRIPTION}/g, subscription === "SUPERSTAR" ? "MVP++" : subscription)
        .replace(/{FIRSTLOGIN}/g, firstLogin.toLocaleString().split("GMT")[0].trim())
        .replace(/{LASTLOGIN}/g, lastLogin.toLocaleString().split("GMT")[0].trim())
        .replace(/{LASTLOGOUT}/g, lastLogout.toLocaleString().split("GMT")[0].trim())
        .replace(/{KARMA}/g, karma)
        .replace(/{NETWORKLEVEL}/g, networklevel)
        .replace(/{NETWORKEXP}/g, networkExp)
        .replace(/{REWARDSTREAK}/g, rewardStreak)
        .replace(/{ACHIEVEMENTPOINTS}/g, achievementPoints)
        .replace(/{USERLANGUAGE}/g, userLanguage)
        .replace(/{SOCIALMEDIA}/g, socialMedia.length === 0 ? "None" : socialMedia.join(" • "))
        .replace(/{BESTREWARDSTREAK}/g, rewardHighScore).replace(/{STATUS}/g, status));
    return message.channel.send(hypixelstats).catch(e => { });
    function getRank(rank) {
      if (rank === "VIP_PLUS") {
        return "VIP+"
      } else if (rank === "MVP_PLUS") {
        return "MVP+"
      }
      return rank;
    }
  }
}