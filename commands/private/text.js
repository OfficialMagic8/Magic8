const { MessageEmbed } = require("discord.js");
module.exports = {
  emoji: "<:8info:693899243525505094>",
  name: "text",
  ignore: true,
  dev: true,
  run: async(bot,message,args)=>{
    message.delete({timeout:500}).catch(e=>{});
    let msg = args.join(" ");
    if(!msg) return message.channel.send(new MessageEmbed().setDescription(`${bot.emoji.cross} **You need to specify a message!**`).setColor(bot.colors.red)).then(m=>m.delete({timeout:10000}).catch(e=>{}))
    let toAlonso = message.author.id === "292821168833036288";
    if(message.guild.id === bot.supportserver){
      message.channel.send(new MessageEmbed().setDescription(`${bot.emoji.check} **Message sent to ${toAlonso?"Alonso":"Fyrlex"}'s mobile!**`).setColor(bot.colors.green))
    }
    msg = `${message.author.tag}: ${msg}`
    if(toAlonso){
      bot.sendMessageAlonso(msg)
    }else{
      bot.sendMessage(msg)
    }
  }
}