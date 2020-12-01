const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: [],
  description: "Toggle profanity filter",
  category: "UTILS",
  emoji: ":gear:",
  name: "filter",
  dev: true,
  run: async (bot,message,args,prefix,guildData)=>{
    if(message.guild.id===bot.supportserver){
      let language = bot.utils.getLanguage(bot,guildData.language);
      message.delete({timeout:500}).catch(e=>{});
      if (!message.member.hasPermission("ADMINISTRATOR")) return;
      if (guildData.togglefilter === 0) {
        bot.database.prepare("UPDATE guilddata SET togglefilter=? WHERE guildid=?").run("1", message.guild.id)
        let enable = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription(bot.utils.getTranslation(bot,language,"filter.toggle.enabled").join("\n").replace(/{CHECK}/g,bot.emoji.check).replace(/{INVITE}/g,bot.invite).replace(/{WARNING}/g,bot.emoji.warning))
          .setFooter(bot.footer)
        message.channel.send(enable).catch(e=>{}).then(m=>m.delete({timeout:15000}).catch(e=>{}))
      } else if (guildData.togglefilter === 1) {
        bot.database.prepare("UPDATE guilddata SET togglefilter=? WHERE guildid=?").run("0", message.guild.id)
        let disable = new MessageEmbed()
          .setColor(bot.colors.red)
          .setDescription(bot.utils.getTranslation(bot,language,"filter.toggle.disabled").join("\n").replace(/{CHECK}/g,bot.emoji.check).replace(/{WARNING}/g,bot.emoji.warning))
          .setFooter(bot.footer)
        message.channel.send(disable).catch(e=>{}).then(m=>m.delete({timeout:15000}).catch(e=>{}))
      }
    }
  }
}