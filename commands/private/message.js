const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["msg"],
  name: "message",
  dev: true,
  ignore: true,
  run: async (bot,message,args,prefix,guildData)=>{
    let target
    if(args[0]){
      let id = args[0].replace(/[^0-9]/g,"");
      try{
        target = bot.users.cache.get(id) || await bot.users.fetch(id);
      }catch(e){
        let error = new MessageEmbed()
          .setDescription(`provide user`)
          .setColor(bot.colors.red)
        return message.channel.send(error).catch(e=>{});
      }
      target.send(args.slice(0).join(" "))
    }  
  }
}