const { MessageEmbed } = require("discord.js");
const requestpromise = require("request-promise");
module.exports = {
  name: "baka",
  aliases: [],
  description: "Call baka to someone!",
  emoji: "👉🏻",
  dev: true,
  //ignore: true,
  toggleable: true,
  category: "REACTIONS",
  run: async(bot,message,args,prefix,guildData)=>{/*
    message.delete({timeout:500}).catch(e=>{})
    let language = bot.utils.getLanguage(bot,guildData.language);
    let target = message.author;
    if(args[0]){
      let id = args[0].replace(/[^0-9]/g,"");
      try{
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      }catch(e){
        let error = new MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"it").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,message.author))
        .setColor(bot.colors.red)
        return message.channel.send(error).catch(e=>{});
      }
    }
    try{
      let link = await bot.nekos.sfw.baka()
        let baka = new MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,`baka.success.${target.id===message.author.id?"self":"other"}.description`).join("\n").replace(/{CHECK}/g,bot.emoji.check).replace(/{USER}/g,message.author).replace(/{TARGET}/g,target))
        .setColor("RANDOM")
        .setImage(link.url)
        .setFooter(`${bot.footer} - Baka`)
      await message.channel.send(baka);
    }catch(e){
      let error = new MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"baka.error.description").join("\n").replace(/{CROSS}/g,bot.emoji.cross).replace(/{USER}/g,message.author))
        .setColor(bot.colors.red)
      return message.channel.send(error).catch(e=>{});
    }*/
  }
}  