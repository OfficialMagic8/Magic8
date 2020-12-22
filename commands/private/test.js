const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const url = "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg";
module.exports = {
  name: "test",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    // bot.updates.addFollower(message.channel.id, "test").then(message.channel.send("works")).catch("doesn't works")
    // bot.error(bot, message, guildData.language)
    // return
    //message.delete({timeout:500}).catch(e=>{});
    // try{
    //   await message.react("🎟️");
    //   await message.channel.send("Reacted!");
    //   await message.react("🎟️");
    //   await message.channel.send("Reacted 2!");
    //   await message.react("🎟️");
    //   await message.channel.send("Reacted 3!");
    //   await message.react("🎟️");
    // }catch(e){
    //   message.channel.send(`Error: ${e.message}`);
    // }

    // return;


    bot.dbl.hasVoted(args[0] || message.author.id).then(voted => {
      message.channel.send(voted ? `${bot.emoji.check} ${message.author} **has voted** in the last **12 hours**!` : `${bot.emoji.cross} ${message.author} **hasn't voted** in the last **12 hours**!`);
    }).catch(e => {
      message.channel.send(`Error ${e.message}`)
    });
    // ["/sys/fs/cgroup/memory/memory.soft_limit_in_bytes",
    //  "/sys/fs/cgroup/memory/memory.stat",
    //  "/sys/fs/cgroup/cpu/cpu.cfs_quota_us",
    //  "/sys/fs/cgroup/cpu/cpu.cfs_period_us",
    //  "/sys/fs/cgroup/cpu/cpuacct.usage"].forEach(path=>{
    //   console.log(`Printing ${path}`)
    //   console.log(require('fs').readFileSync(path, "utf8"))
    // })
    let cpu = Math.round(process.cpuUsage().system)
    let cpupercent = Math.round((cpu * 128) / 1000) / 10;
    console.log("cpuUsage()")
    console.log(cpu)
    console.log(cpupercent)
    return;
    let msg = args.join(" ")
    if (!msg) return message.channel.send("Speficy a fucking message!")
    const canvas = Canvas.createCanvas(1024, 450)
    const ctx = canvas.getContext('2d')
    let backgroundimg = await Canvas.loadImage(url)
    ctx.drawImage(backgroundimg, 0, 0, backgroundimg.width, backgroundimg.height)
    ctx.fillStyle = '#ffffff';
    ctx.fillText(msg, 20, 20)

    return message.channel.send(`Your text: ${msg}`, {
      files: [{
        attachment: canvas.toBuffer(),
        name: `Testing message ${msg} by ${message.author.tag}.png`
      }]
    });
    let answer = await bot.nekos.sfw.OwOify({ text: args.join(" ") || "" })
    return message.channel.send(answer.owo)
    return bot.emit("guildMemberAdd", message.member)
    let guilds = bot.guilds.sort((a, b) => b.members.size - a.members.size).array().map(guild => `${guild.name}: ${guild.members.size}members`);
    message.channel.send(guilds.slice(0, 10).join("\n"))
    //   setTimeout(()=>{
    //     message.reply("PING!");
    //   },3000);
    //bot.emit("guildCreate",message.guild)
  }
}