const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  name: "leave",
  ignore: true,
  dev: true,
  run: async(bot,message,args,prefix,guildData)=>{
    message.delete({timeout:500}).catch(e=>{});
    let guild = bot.guilds.cache.get(args[0])
    setTimeout(() => {
      guild.leave()
    },10000)
    // let channelsToSend = guild.channels.cache.filter(c=>c.type === "text").filter(c=>{
    //   let permissions = guild.me.permissionsIn(c)
    //   if(permissions) return permissions.has("SEND_MESSAGES");
    //   return false;
    // })
    // if(channelsToSend.size >= 1){
    //   let channelToSend = channelsToSend.random();
    //   let welcomeArray = [`**${bot.user} will disconnect from your guild in __10__ seconds!**`,
    //                       ``,
    //                       `${bot.emoji.cross} **Check the Terms of Service: <${bot.botconfig.tos}>**`,
    //                       ``,
    //                       `**Developer Note**`,
    //                       `${message.content.slice(27)}`,
    //                       ``,
    //                       `**When you have changed your ways and feel that ${bot.user} can be back in your server, here is the invite link:**`,
    //                       `<${bot.botconfig.botinvite}>`,
    //                       ``,
    //                       `- If you believe there was a mistake, please join **support server** at <${bot.invite}> so we can resolve the issue.`]
    //   channelToSend.send(welcomeArray.join("\n")).catch(e=>{console.log(e)})
    // }
    message.channel.send(`I have been removed from \`${guild.name}\` with ID \`${guild.id}!\``)
  }
}