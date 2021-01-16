module.exports.topgg = async (bot, body) => {
  let fyrlex = bot.users.cache.get("292821168833036288")
  let unknown = false;
  let user;
  if (bot.users.cache.has(body.user)) {
    user = bot.users.cache.get(body.user);
  } else {
    try {
      user = await bot.users.fetch(body.user);
    } catch (e) {
      console.error(e);
      unknown = true;
      user = {
        id: body.user,
        tag: "Unkown User#0000"
      }
    }
  }
  let votedfor;
  if (body.bot) {
    votedfor = bot.user;
  } else if (body.guild) {
    votedfor = bot.guilds.cache.get(body.guild).name;
  }
  if (body.bot) {
    let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id));
    userguilds.forEach(guild => {
      let voteData = bot.vdb.prepare("SELECT * FROM votedata WHERE guildid=?").get(guild.id);
      if (!voteData) {
        bot.utils.registerGuildVotes(bot, guild);
      }
      bot.vdb.prepare("UPDATE votedata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
      bot.vdb.prepare("UPDATE votedata SET totalvotes=? WHERE guildid=?").run(voteData.totalvotes + 1, guild.id);
      bot.vdb.prepare("UPDATE votedata SET monthlyvotes=? WHERE guildid=?").run(voteData.monthlyvotes + 1, guild.id);
      bot.monthlyvotes.set(guild.id, bot.monthlyvotes.get(guild.id) ? bot.monthlyvotes.get(guild.id) : voteData.monthlyvotes);
      bot.totalvotes.set(guild.id, bot.totalvotes.get(guild.id) ? bot.totalvotes.get(guild.id) : voteData.totalvotes);
      if (bot.monthlyvotes.get(guild.id) % 25) {
        let embed = new MessageEmbed()
          .setColor(bot.colors.green)
          .setDescription([
            `**Guild:** ${guild.name} (${guild.id})`,
            `**Votes:** ${bot.monthlyvotes.get(guild.id)}`])
        return fyrlex.send(embed).catch(e => { })
      }
    });
    console.log(`☑️ Set 'hasvoted' to TRUE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
  }

  let usertag = user.tag;
  let weekend = body.isWeekend ? body.isWeekend : `false`;
  const { MessageEmbed } = require("discord.js");
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Magic8 Developers`]);
  user.send(dm).catch(e => { });
  let votemsg = new MessageEmbed()
    .setColor(body.type === "test" ? bot.colors.red : bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Bot List`)
    .setDescription([
      `**Voter:** ${unknown ? `<@${body.user}>` : user} (${usertag})`,
      `**Weekend Bonus:** ${weekend}`,
      `**Voted For:** ${votedfor}`,
      ``,
      `*You can vote again in 12 hours [here](https://top.gg/bot/484148705507934208)*`])
  return bot.webhook.send(votemsg).catch(e => { });
}
module.exports.labs = async (bot, body) => {
  let unknown = false;
  let user;
  if (bot.users.cache.has(body.uid)) {
    user = bot.users.cache.get(body.uid);
  } else {
    try {
      user = await bot.users.fetch(body.uid);
    } catch (e) {
      console.error(e);
      unknown = true;
      user = {
        id: body.uid,
        tag: "Unkown User#0000"
      };
    };
  };
  let usertag = user.tag;
  const { MessageEmbed } = require("discord.js");
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Magic8 Developers`])
  user.send(dm).catch(e => { });
  let votemsg = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Labs`)
    .setDescription([
      `**Voter:** ${unknown ? `<@${body.user}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote again in 12 hours [here](https://top.gg/bot/484148705507934208)*`]);
  return bot.webhook.send(votemsg).catch(e => { });
}
module.exports.boats = async (bot, body) => {
  let unknown = false;
  let user;
  if (bot.users.cache.has(body.user.id)) {
    user = bot.users.cache.get(body.user.id);
  } else {
    try {
      user = await bot.users.fetch(body.user.id);
    } catch (e) {
      console.error(e);
      unknown = true;
      user = {
        id: body.user.id,
        tag: "Unkown User#0000"
      }
    }
  }
  let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id));
  userguilds.forEach(guild => {
    let voteData = bot.vdb.prepare("SELECT * FROM votedata WHERE guildid=?").get(guild.id);
    if (!voteData) {
      bot.utils.registerGuildVotes(bot, guild);
    }
    bot.vdb.prepare("UPDATE votedata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
    bot.vdb.prepare("UPDATE votedata SET totalvotes=? WHERE guildid=?").run(voteData.totalvotes + 1, guild.id);
    bot.vdb.prepare("UPDATE votedata SET monthlyvotes=? WHERE guildid=?").run(voteData.monthlyvotes + 1, guild.id);
    bot.monthlyvotes.set(guild.id, bot.monthlyvotes.get(guild.id) ? bot.monthlyvotes.get(guild.id) : voteData.monthlyvotes);
    bot.totalvotes.set(guild.id, bot.totalvotes.get(guild.id) ? bot.totalvotes.get(guild.id) : voteData.totalvotes);
    if (bot.monthlyvotes.get(guild.id) % 25) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([
          `**Guild:** ${guild.name} (${guild.id})`,
          `**Monthly Votes:** ${bot.monthlyvotes.get(guild.id)}`,
          `**Total Votes:** ${bot.totalvotes.get(guild.id)}`])
      return fyrlex.send(embed).catch(e => { })
    }
  });
  console.log(`☑️ Set 'hasvoted' to TRUE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
  const { MessageEmbed } = require("discord.js");
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Magic8 Developers`]);
  user.send(dm).catch(e => { });
  let usertag = user.tag;
  let votemsg = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Boats`)
    .setDescription([
      `**User:** ${unknown ? `<@${body.user.id}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote again in 12 hours [here](https://discord.boats/bot/484148705507934208)*`]);
  return bot.webhook.send(votemsg).catch(e => { });
}
module.exports.botlistspace = async (bot, body) => {
  let unknown = false;
  let user;
  if (bot.users.cache.has(body.user.id)) {
    user = bot.users.cache.get(body.user.id);
  } else {
    try {
      user = await bot.users.fetch(body.user.id);
    } catch (e) {
      console.error(e);
      unknown = true;
      user = {
        id: body.user.id,
        tag: "Unkown User#0000"
      }
    }
  }
  let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id));
  userguilds.forEach(guild => {
    let voteData = bot.vdb.prepare("SELECT * FROM votedata WHERE guildid=?").get(guild.id);
    if (!voteData) {
      bot.utils.registerGuildVotes(bot, guild);
    }
    bot.vdb.prepare("UPDATE votedata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
    bot.vdb.prepare("UPDATE votedata SET totalvotes=? WHERE guildid=?").run(voteData.totalvotes + 1, guild.id);
    bot.vdb.prepare("UPDATE votedata SET monthlyvotes=? WHERE guildid=?").run(voteData.monthlyvotes + 1, guild.id);
    bot.monthlyvotes.set(guild.id, bot.monthlyvotes.get(guild.id) ? bot.monthlyvotes.get(guild.id) : voteData.monthlyvotes);
    bot.totalvotes.set(guild.id, bot.totalvotes.get(guild.id) ? bot.totalvotes.get(guild.id) : voteData.totalvotes);
    if (bot.monthlyvotes.get(guild.id) % 25) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([
          `**Guild:** ${guild.name} (${guild.id})`,
          `**Monthly Votes:** ${bot.monthlyvotes.get(guild.id)}`,
          `**Total Votes:** ${bot.totalvotes.get(guild.id)}`])
      return fyrlex.send(embed).catch(e => { })
    }
  });
  console.log(`☑️ Set 'hasvoted' to TRUE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
  const { MessageEmbed } = require("discord.js");
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Magic8 Developers`]);
  user.send(dm).catch(e => { });
  let usertag = user.tag;
  let votemsg = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`botlist.space`)
    .setDescription([
      `**User:** ${unknown ? `<@${body.user.id}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote again in 12 hours [here](https://botlist.space/bot/484148705507934208)*`]);
  return bot.webhook.send(votemsg).catch(e => { });
}
module.exports.blist = async (bot, body) => {
}
module.exports.discordbotlist = async (bot, body) => {
}
module.exports.abstractlist = async (bot, body) => {
}
module.exports.idledev = async (bot, body) => {
}
module.exports.bladebotlist = async (bot, body) => {
  let unknown = false;
  let user;
  if (bot.users.cache.has(body.user.id)) {
    user = bot.users.cache.get(body.user.id);
  } else {
    try {
      user = await bot.users.fetch(body.user.id);
    } catch (e) {
      console.error(e);
      unknown = true;
      user = {
        id: body.user.id,
        tag: "Unkown User#0000"
      }
    }
  }
  let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id));
  userguilds.forEach(guild => {
    let voteData = bot.vdb.prepare("SELECT * FROM votedata WHERE guildid=?").get(guild.id);
    if (!voteData) {
      bot.utils.registerGuildVotes(bot, guild);
    }
    bot.vdb.prepare("UPDATE votedata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
    bot.vdb.prepare("UPDATE votedata SET totalvotes=? WHERE guildid=?").run(voteData.totalvotes + 1, guild.id);
    bot.vdb.prepare("UPDATE votedata SET monthlyvotes=? WHERE guildid=?").run(voteData.monthlyvotes + 1, guild.id);
    bot.monthlyvotes.set(guild.id, bot.monthlyvotes.get(guild.id) ? bot.monthlyvotes.get(guild.id) : voteData.monthlyvotes);
    bot.totalvotes.set(guild.id, bot.totalvotes.get(guild.id) ? bot.totalvotes.get(guild.id) : voteData.totalvotes);
    if (bot.monthlyvotes.get(guild.id) % 25) {
      let embed = new MessageEmbed()
        .setColor(bot.colors.green)
        .setDescription([
          `**Guild:** ${guild.name} (${guild.id})`,
          `**Monthly Votes:** ${bot.monthlyvotes.get(guild.id)}`,
          `**Total Votes:** ${bot.totalvotes.get(guild.id)}`])
      return fyrlex.send(embed).catch(e => { });
    }
  });
  console.log(`☑️ Set 'hasvoted' to TRUE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
  const { MessageEmbed } = require("discord.js");
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Magic8 Developers`]);
  user.send(dm).catch(e => { });
  let usertag = user.tag;
  let votemsg = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Boats`)
    .setDescription([
      `**User:** ${unknown ? `<@${body.user.id}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote again in 12 hours [here](https://bladebotlist.xyz/bot/484148705507934208/)*`]);
  return bot.webhook.send(votemsg).catch(e => { });
}