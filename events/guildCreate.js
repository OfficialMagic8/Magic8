const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildCreate",
  run: async (bot, guild) => {
    let text = `📚 Guilds : ${bot.guilds.cache.size}`;
    let channel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.guildstats);
    if (channel) {
      if (channel.name !== text) {
        try {
          channel.setName(text);
        } catch (e) {
          console.error(e);
        }
      }
    }
    let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
    bot.db.prepare("UPDATE guilddata SET inguild=? WHERE guildid=?").run("true", guild.id);
    let isNewGuild = false;
    if (guildData) {
      bot.utils.updateGuild(bot, guild);
      bot.premium.set(guild.id, guildData.premium);
    } else {
      isNewGuild = true;
      bot.utils.registerGuild(bot, guild);
      bot.premium.set(guild.id, 0)
      guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
    }
    let usageData = bot.udb.prepare("SELECT * FROM usagedata WHERE guildid=?").get(guild.id);
    if (usageData) {
      bot.utils.updateGuildUsage(bot, guild);
    } else {
      bot.utils.registerGuildUsage(bot, guild)
    }
    let channelsToSend = guild.channels.cache.filter(c => c.type === "text").filter(c => {
      let permissions = guild.me.permissionsIn(c);
      if (permissions) return permissions.has("SEND_MESSAGES");
      return false;
    });
    if (channelsToSend.size >= 1) {
      let followstring = `${bot.emoji.check} Update notifications will automatically be sent here. To disable them, go to your Integrations settings for your server.`;
      let channelToSend = channelsToSend.random();
      if (guild.me.hasPermission(["MANAGE_WEBHOOKS"])) {
        bot.updates.addFollower(channelToSend.id, `Subscribed to updates`).then(() => {
          console.log(`♻️ Join Guild With Updates - ${guild.name} (${guild.id})`)
        }).catch(e => {
          console.log(`🚫 Could Not Not Follow Updates - ${guild.name} (${guild.id})`)
        })
      } else {
        followstring = `${bot.emoji.info} To be notified of updates, please type: \`${guildData.prefix}follow updates\``
        console.log(`🚫 Could Not Not Follow Updates - ${guild.name} (${guild.id})`)
      }
      let welcomeArray = [
        `>>> ${bot.emoji.check} **Thank you for adding me!** I hope to enjoy my time here :)`,
        ``,
        `📝 Prefix: \`${guildData.prefix}\``,
        `❔ Help Menu: \`${guildData.prefix}help\``,
        `⚙️ Custom Prefix: \`${guildData.prefix}prefix\``,
        `🌎 **Languages:** \`${guildData.prefix}langs\``,
        `🔖 **Guide:** <${bot.docs.main}>`,
        ``,
        followstring,
        ``,
        `- Please make sure I can send **Embed Links**, otherwise I will **not** work.`,
        `- If you need help, feel free to join our Support Server: <${bot.invite}>`,
        `- Follow our Terms & Conditions: <${bot.docs.terms}>`
      ];
      channelToSend.send(welcomeArray.join("\n")).catch(e => { });
    }
    let users = guild.members.cache.filter(m => !m.user.bot).size;
    let joined = guild.joinedAt.toLocaleString().split("GMT")[0].trim();
    let channels = guild.channels.cache.filter(c => c.type !== "category").size;
    let bots = guild.members.cache.filter(m => m.user.bot).size;
    let created = guild.createdAt.toLocaleString().split("GMT")[0].trim();
    let owner = bot.users.cache.get(bot.guilds.cache.get(guild.id).ownerID) || await bot.users.fetch(bot.guilds.cache.get(guild.id).ownerID);
    let embed = new MessageEmbed()
      .setTitle(`${isNewGuild ? bot.emoji.plus : bot.emoji.return} - Guild Join`)
      .setColor(bot.colors.green)
      .setThumbnail(guild.iconURL({ format: "png" }))
      .setDescription([
        `**Name:** ${guild.name} (**${guild.id}**)`,
        ``,
        `**Users/Bots/Channels:** (${users}/${bots}/${channels})`,
        ``,
        `**Owner:** ${owner}/${owner.tag} (${owner.id})`,
        `**Joined:** ${joined}`,
        `**Date Created:** ${created}`])
    let logsChannel = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.guildlogs);
    if (logsChannel) {
      logsChannel.send(embed).catch(e => { });
    }
    // let timechange = new Date(new Date().getTime() - 4 * 3600000).toLocaleString();
    // let cdate = guild.createdAt.toString().split(" ");
    // let users = guild.members.cache.filter(m => !m.user.bot).size;
    // let bots = guild.members.cache.filter(m => m.user.bot).size;
    // let channels = guild.channels.cache.size;
    // bot.sendMessage(`NEW GUILD: '${guild.name}'\nID: '${guild.id}'\nCreated: ${cdate[1]}, ${cdate[2]} ${cdate[3]}\n\n(${users}/${bots}/${channels})\n${timechange}`);
  }
};