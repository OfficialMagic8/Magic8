const Discord = require("discord.js");
const requestpromise = require("request-promise");
module.exports = {
  aliases: ["quotes"],
  description: "Receive an inspirational quote!",
  emoji: "💬",
  name: "quote",
  hidden: true,
  ignore: true,
  beta: true,
  dev: true,
  category: "RANDOM",
  run: async(bot,message,args,prefix,guildData)=>{
    let language = bot.utils.getLanguage(bot,guildData.language);
    //message.delete({timeout:500}).catch(e=>{});
    let p
    let req
    try{
      req = await requestpromise(`https://type.fit/api/quotes`);
      // p = JSON.parse(req)
    }catch(e){
      // console.error(e)
      let error = new Discord.MessageEmbed()
        .setDescription(bot.utils.getTranslation(bot,language,"quote.error.unexpected").join("\n")
                        .replace(/{CROSS}/g,bot.emoji.cross)
                        .replace(/{PREFIX}/g,prefix))
        .setColor(bot.colors.red)
      return message.channel.send(error).catch(e=>{}).then(m=>m.delete({timeout:10000}).catch(e=>{}))
    }
    // console.log(req)
    // console.log(p)
    const result = req.find((author) => author === "Thomas Edison");
    console.log(result)
    // let quote = result[Math.floor(Math.random() * result.length)]
    // console.log(quote)
    // let quoteEmbed = new Discord.MessageEmbed()
    //   .setColor(bot.colors.main)
    //   .setDescription([`**Here is your random, insipirtational quote, ${message.author}**`,
    //                    ``,
    //                    `"${req[Math.floor(Math.random() * req.length)]}"`].join("\n"))
    // return message.channel.send(quoteEmbed).catch(e=>{})
  }
}