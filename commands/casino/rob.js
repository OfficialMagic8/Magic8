const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["steal"],
  description: "Rob another casino member!",
  emoji: "",
  name: "rob",
  hidden: true,
  ignore: true,
  beta: true,
  dev: true,
  category: "CASINO",
  run: async (bot,message,args,prefix,guildData) => {
    //message.delete({timeout:500}).catch(e=>{});
    let target;
    if (args[0]) {
      let id = args[0].replace(/[^0-9]/g,"");
      target = bot.users.cache.get(id);
      if (!target.user) {
        let helpMenu = new MessageEmbed()
          .setColor(bot.colors.lightred)
          .setDescription([`${bot.emoji.cross} **${message.author}, to steal, please provide a valid user or ID that is also in the casino!**`,
                           `To view a list of users in the casino, type: \`${prefix}casino list\``].join("\n"))
        return message.channel.send(helpMenu).catch(e=>{}).then(m=>m.delete({timeout:15000}).catch(e=>{}));
      }
      if(message.author.id === target.id){
        let error = new MessageEmbed()
          .setDescription(`${bot.emoji.cross} **${message.author}, you cannot rob yourself!**`)
          .setColor(bot.colors.red)
        return message.channel.send(error).catch(e=>{});
      }
    }
    if (!target.user || !bot.playingcasino.has(target.id)) {
      let helpMenu = new MessageEmbed()
        .setColor(bot.colors.lightred)
        .setDescription([`${bot.emoji.cross} **${message.author}, to steal, please provide a valid user or ID that is also in the casino!**`,
                           `To view a list of users in the casino, type: \`${prefix}casino list\``,
                           ``,
                           `Before you attempt to steal, please note that your chances of getting caught are **20%**.`,
                           `Each time you successfully steal, you have a **5%** higher chance of getting caught no matter the amount of money you take. If you are caught, you have a **10%** increased chance of getting caught again and will lose **the same** amount you tried to steal!`].join("\n"))
      return message.channel.send(helpMenu).catch(e=>{}).then(m=>m.delete({timeout:15000}).catch(e=>{}));
    }
    let amount = Math.floor(args[1])
    if (!amount || isNaN(amount)) {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **${message.author}, please provide a number that is no higher than the target's current balance! You cannot rob users with less than 300 coins and cannot take more than double your current balance!**`)
      return message.channel.send(error).catch(e=>{})
    }
    let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
    let targetData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(target.id);
    if (amount > userData.coins*2) {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **${message.author}, the value you provided, \`${amount}\`, was more than double your own balance! Please use a lower value!**`)
      return message.channel.send(error).catch(e=>{})
    }
    if (amount > targetData.coins-300) {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription(`${bot.emoji.cross} **${message.author}, you cannot provide a value that will leave the target with less than 300 coins!**`)
      return message.channel.send(error).catch(e=>{})  
    }
    bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins-200,message.author.id);
    let robbedEmbed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription([`**${message.author}, you were charged \`200\` coins for the robbery setup and are now attempting to rob ${target}**`,
                       ``,
                       `**Attempted value:** ${amount}`,
                       `**Stealing Risk:** ${userData.stealingrisk}%`,
                       ``,
                       `${bot.emoji.loading}*Please wait a moment...*`].join("\n"))
    let robbedMessage
    try{
      robbedMessage = await message.channel.send(robbedEmbed)
    }catch(e){
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription([`${bot.emoji.cross} **${message.author}, something interfered with your robbery!`,
                         ``,
                         `Your stealing risk is still the same but you were still charged for the setup!**`].join("\n"))
      message.channel.send(error).catch(e=>{})
      await robbedMessage.delete({timeout:15000}).catch(e=>{})
    }
    let randomNumber = Math.floor(Math.random() * 100) + 1
    let robValue = parseInt(amount)
    setTimeout(async ()=>{
      if (randomNumber <= userData.stealingrisk) {
        let robbedFailDescription = [
          `**${message.author}, you were caught stealing in the casino by Magic8 Administrators!**`,
          ``,
          `${target} still has his money! You lost \\💰**${amount}** and your stealing risk was increased to ${userData.stealingrisk + 10}!`
        ]
        robbedEmbed.setDescription(robbedFailDescription)
        robbedEmbed.setColor(bot.colors.lightred)
        try{
          await robbedMessage.edit(robbedEmbed)
          bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins-robValue,message.author.id);
          bot.database.prepare("UPDATE usersinfo SET stealingrisk=? WHERE userid=?").run(userData.stealingrisk+10,message.author.id);
        }catch(e){
          // bot.database.prepare("UPDATE usersinfo SET stealingrisk=? WHERE userid=?").run(userData.stealingrisk-10,message.author.id);
          // bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins+200,message.author.id);
          let error = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **${message.author}, something interfered with your robbery that would have been a success!`,
                             ``,
                             `Your stealing risk is still the same but you were still charged for the setup!**`].join("\n"))
          message.channel.send(error).catch(e=>{})
          await robbedMessage.delete({timeout:15000}).catch(e=>{})
        }
      } else {
        let robbedSuccessDescription = [
          `${bot.emoji.check}**${message.author}, your robbery was a sneaky success!**`,
          ``,
          `${bot.emoji.cross }${target} lost \\💰**${amount}**! You gained \\💰**${amount}** for a total of \\💰**${userData.coins+robValue}**, but your stealing risk is now **${userData.stealingrisk + 5}**!`
        ]
        robbedEmbed.setDescription(robbedSuccessDescription)
        try{
          await robbedMessage.edit(robbedEmbed)
          bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(targetData.coins-robValue,target.id);
          bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins+robValue,message.author.id);
          bot.database.prepare("UPDATE usersinfo SET stealingrisk=? WHERE userid=?").run(userData.stealingrisk+5,message.author.id);
        }catch(e){
          // bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(targetData.coins+robValue,target.id);
          // bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(userData.coins-robValue,message.author.id);
          // bot.database.prepare("UPDATE usersinfo SET stealingrisk=? WHERE userid=?").run(userData.stealingrisk-5,message.author.id);
          
          let error = new MessageEmbed()
            .setColor(bot.colors.red)
            .setDescription([`${bot.emoji.cross} **${message.author}, something interfered with your robbery that would have failed anyways!`,
                            ``,
                            `Your stealing risk is still the same but you were still charged for the setup!**`].join("\n"))
          message.channel.send(error).catch(e=>{})
          await robbedMessage.delete({timeout:15000}).catch(e=>{})
        }
      }
    },5000)
  // log.info(`🎲 ${message.author.tag} stole from ${target.tag}`)
  }
}