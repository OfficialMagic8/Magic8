const { MessageEmbed } = require("discord.js");
const requestpromise = require("request-promise");
module.exports = {
  name: "neko",
  aliases: ["spoilers"],
  emoji: "<:8anime:697119214519189577>",
  description: "Spoiler command!",
  dev: true,
  category: "NSFW",
  run: async(bot,message,args,prefix,guildData)=>{
    return;
    message.delete({timeout:500}).catch(e=>{})
    let language = bot.utils.getLanguage(bot,guildData.language);
    try{
      let link = Math.floor(Math.random()*100) < 50?await bot.nekos.sfw.nekoGif():await bot.nekos.sfw.neko()
      let neko = new MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"neko.success.description").join("\n").replace(/{CHECK}/g,bot.emoji.check).replace(/{USER}/g,message.author))
        .setColor(bot.colors.blue)
        .setImage(link.url)
        .setFooter(`${bot.footer} - Neko`)
      message.channel.send(neko);
    }catch(e){
      let error = new MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"neko.error.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,message.author))
        .setColor(bot.colors.red)
      return message.channel.send(error);
    }
  }
}