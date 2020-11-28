const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
module.exports = {
  aliases: [],
  name: "flist",
  dev: true,
  run: async(bot,message,args,prefix,guildData)=>{
    message.delete({timeout:500}).catch(e=>{})
    let info = []
    let guilds = bot.guilds.cache.keyArray()
    for (let guild of guilds) {
      let guildData = bot.database.prepare("SELECT * FROM guildsinfo WHERE guildid=?").get(guild)
      let users = bot.guilds.cache.get(guild).members.cache.filter(m=>!m.user.bot).size;
      let channels = bot.guilds.cache.get(guild).channels.cache.filter(c=>c.type!=="category").size
      let bots = bot.guilds.cache.get(guild).members.cache.filter(m=>m.user.bot).size
        info.push([`${bot.guilds.cache.get(guild).name} - ${guild}`,
                   `${users}/${bots}/${channels}`,
                   `prefix: ${guildData.prefix}`].join("\n"))
    }
    hastebin(info.join("\n\n"), { url: "https://paste.mod.gg", extension: "txt"  }).then(haste => {
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.main)
      .setDescription(haste)
    message.channel.send(embed)
    }).catch(error => {
        console.error(error);
    });
  }
}