const Discord = require("discord.js")
module.exports = {
  aliases: [],
  description: "fyrlex test",
  emoji: "",
  name: "ftest",
  hidden: true,
  ignore: true,
  beta: true,
  dev: true,
  category: "FUN",
  run: async(bot,message,args,prefix,guildData,log)=>{
    message.delete({timeout:500}).catch(e=>{})
    try {
      log.info("hello")
    }catch (e) {
      console.error(e)
    }
  }
}