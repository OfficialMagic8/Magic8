const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["rtd","dice"],
  category: "CASINO",
  description: "Place a bet and roll the dice!",
  emoji: "🎲",
  name: "rollthedice",
  dev: true,
  run: async(bot,message,args,prefix,guildData)=>{
    message.delete({timeout:500}).catch(e=>{});
    if(bot.playingrtd.has(message.author.id)){
      let alreadyplaying = new MessageEmbed()
        .setDescription([`${bot.emoji.cross} **${message.author}, you are already playing somewhere else!**`].join("\n"))
        .setColor(bot.colors.red)
      return message.channel.send(alreadyplaying).catch(e=>{})
    }
    let bet = args[0]
    let number = args[1]
    if (!bet || !number || isNaN(bet) || isNaN(number) || number > 6 || number < 1) {
      let error = new MessageEmbed()
        .setColor(bot.colors.red)
        .setDescription([`${bot.emoji.cross} **${message.author}, please provide a valid amount of coins to bet and on a number 1-6!**`,
                         ``,
                         `Example: \`${prefix}rtd 230 4\``].join("\n"))
      return message.channel.send(error).catch(e=>{})
    }
    let rtdEmbed = new MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription([`**__Roll The Dice__**`,
                       `**Player: ${message.author}**`,
                       `**Bet:** ${bet}`,
                       `**Number:** ${number}`,
                       ``,
                       `*Roll the 🎲 to start!*`].join("\n"))
    let rtdMessage;
    try{
      rtdMessage = await message.channel.send(rtdEmbed)
    }catch(e){
      let error = new MessageEmbed()
        .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you roll the die!**`)
        .setColor(bot.colors.red)
        .setFooter(bot.footer)
      return message.channel.send(error).catch(e=>{})
    }
    bot.playingrtd.set(message.author.id)
    setTimeout(async () => {
      rtdMessage.react("🎲").catch(e=>{
        bot.playingrtd.delete(message.author.id)
        let error = new MessageEmbed()
          .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you roll the die!**`)
          .setColor(bot.colors.red)
          .setFooter(bot.footer)
        return message.channel.send(error).catch(e=>{})
      })
      let filter = (reaction,user) => !user.bot && user.id === message.author.id && reaction.emoji.name === "🎲"
      let collected;
      try{
        collected = await rtdMessage.awaitReactions(filter,{max:1,time:20000,errors:["time"]})
      }catch(e){}
      let rollingDesc = [
        `**__Roll The Dice__**`,
         `**Player: ${message.author}**`,
         `**Bet:** ${bet}`,
         `**Number:** ${number}`,
         ``,
         `${bot.emoji.animateddie}`,
         ``,
         `*${bot.emoji.loading} Rolling the die...*`
      ]
      rtdEmbed.setDescription(rollingDesc)
      try{
        await rtdMessage.edit(rtdEmbed)
      }catch(e){
        bot.playingrtd.delete(message.author.id)
        let error = new MessageEmbed()
          .setDescription(`${bot.emoji.cross} **${message.author}, there was an error letting you roll the die!**`)
          .setColor(bot.colors.red)
          .setFooter(bot.footer)
        return message.channel.send(error).catch(e=>{})
      }
      setTimeout(async () => {
      let randomNumber = Math.floor(Math.random() * 6) + 1
      let userData = bot.database.prepare("SELECT * FROM usersinfo WHERE userid=?").get(message.author.id);
      let demoji
      if (randomNumber === 1) {
        demoji = bot.emoji.diceone
      } else if (randomNumber === 2) {
        demoji = bot.emoji.dicetwo
      } else if (randomNumber === 3) {
        demoji = bot.emoji.dicethree
      } else if (randomNumber === 4) { 
        demoji = bot.emoji.dicefour
      } else if (randomNumber === 5) {
        demoji = bot.emoji.dicefive
      } else if (randomNumber === 6) {
        demoji = bot.emoji.dicesix
      }
      let enddesc
      let win = (parseInt(number) === randomNumber)
      // console.log(win)
      // console.log(`B/N: ${parseInt(number)} - ${randomNumber}`)
      bot.playingrtd.delete(message.author.id)
      bot.database.prepare("UPDATE usersinfo SET coins=? WHERE userid=?").run(win?userData.coins+parseInt(bet):userData.coins-parseInt(bet),message.author.id);
      enddesc = [
      `**__Roll The Dice__**`,
       `**Player: ${message.author}**`,
       `**Bet:** ${bet}`,
       `**Number:** ${number}`,
       ``,
       `The die landed on: ${demoji}`,
       ``,
       `${win?bot.emoji.check:bot.emoji.cross} You ${win?"won":"lost"} \\💰**${bet}**!`
      ]
      rtdEmbed.setColor(win?bot.colors.green:bot.colors.red)
      rtdEmbed.setDescription(enddesc.join("\n"))
      rtdMessage.reactions.removeAll().catch(e=>{});
      rtdMessage.edit(rtdEmbed).catch(e=>{})
      },4000)
    },1000)
  }
}