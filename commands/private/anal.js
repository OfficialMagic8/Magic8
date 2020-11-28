const Discord = require("discord.js");
module.exports = {
  name: "anal",
  aliases: [],
  description: "Random anal image!",
  emoji: "👌🏻",
  toggleable: true,
  dev: true,
  category: "NSFW",
  run: async(bot,message,args,prefix,guildData)=>{
    return;
    message.delete({timeout:500}).catch(e=>{})
    let language = bot.utils.getLanguage(bot,guildData.language);
    let target = message.author;
    if(args[0]){
      let id = args[0].replace(/[^0-9]/g,"");
      try{
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      }catch(e){
        let error = new Discord.MessageEmbed()
          .setDescription(bot.utils.getTranslation(bot,language,"it").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,message.author))
          .setColor(bot.colors.red)
        return message.channel.send(error);
      }
    }
    try{
      let link = await bot.nekos.nsfw.anal()
      let anal = new Discord.MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,`anal.success.${target.id===message.author.id?"self":"other"}.description`).join("\n").replace(/{CHECK}/g,bot.emoji.check).replace(/{USER}/g,message.author).replace(/{TARGET}/g,target))
        .setColor("RANDOM")
        .setImage(link.url)
        .setFooter(`${bot.footer} - Anal`)
      message.channel.send(anal);
    }catch(e){
      let error = new Discord.MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"anal.error.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,message.author))
        .setColor(bot.colors.red)
      return message.channel.send(error);
    }
  }
}  