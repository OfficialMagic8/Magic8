const Discord = require("discord.js");
const requestpromise = require("request-promise");
let idByName = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{SUMMONERNAME}?api_key={KEY}";
let maestryLevels = "https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SUMMONERID}?api_key={KEY}";
module.exports = {
  aliases: [],
  description: "Show League Of Legends information",
  emoji: ":basket:",
  name: "leagueoflegends",
  dev: true,
  category: "MISCELLANEOUS",
  run: async(bot,message,args,prefix,guildData)=>{
    message.delete({timeout:500}).catch(e=>{});
    let language = bot.utils.getLanguage(bot,guildData.language);
    let username = args[0];
    if(!args[0]){
      return message.channel.send("Specify username!")
    }

    let mainInfo = JSON.parse(await requestpromise(idByName.replace(/{SUMMONERNAME}/g,username).replace(/{KEY}/g,process.env.RIOTKEY)))
    let puuid = mainInfo.puuid
    let profileIconId = mainInfo.profileIconId
    let accountId = mainInfo.accountId
    let summonerid = mainInfo.id
    username = mainInfo.name
    let level = mainInfo.summonerLevel

    console.log(mainInfo);
    let maestryInfo = JSON.parse(await requestpromise(maestryLevels.replace(/{SUMMONERID}/g,summonerid).replace(/{KEY}/g,process.env.RIOTKEY)))

    let playerInfo = new Discord.MessageEmbed()
    .setAuthor("Information about {USERNAME}".replace(/{USERNAME}/g,username))
    .setDescription("**Username:** {USERNAME}\n**Level:** {LEVEL}".replace(/{USERNAME}/g,username)
                    .replace(/{LEVEL}/g,level)/*.replace(/{}/g,).replace(/{}/g,).replace(/{}/g,).replace(/{}/g,).replace(/{}/g,)*/)
    .setColor(bot.colors.main)

    message.channel.send(playerInfo);

    return;
    if(!target){ 
      let error = new Discord.MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(bot.utils.getTranslation(bot,language,"howgay.error.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross))
      return message.channel.send(error)
    }
    let howgay = new Discord.MessageEmbed()
      .setColor(bot.colors.pink)
      .setDescription(bot.utils.getTranslation(bot,language,"howgay.success.description").join("\n").replace(/{TARGET}/g,target)
                      .replace(/{PERCENT}/g,Math.floor(Math.random() * 101))
                      .replace(/{CHECK}/g,bot.emoji.check).replace(/{USER}/g,target))
      .setFooter(bot.utils.getTranslation(bot,language,"howgay.success.footer").replace(/{BOTNAME}/g,bot.user.username)
                 .replace(/{VERSION}/g,bot.botconfig.version).replace(/{AUTHOR}/g,message.author.tag), bot.user.displayAvatarURL)
    message.channel.send(howgay).catch(e=>{});
  }
}