module.exports.dbl = async (bot, request) => {
  let body = request.body
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
  let timeout;
  if (body.bot) resetTimeout();
  function startTimeout() {
    timeout = setTimeout(function () {
      let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id))
      userguilds.forEach(guild => {
        bot.db.prepare("UPDATE guilddata SET hasvoted=? WHERE guildid=?").run("false", guild.id);
        bot.usage.set(guild.id, 0)
      });
      console.log(`☑️ Set 'hasvoted' to FALSE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
    }, 43200000)
  }
  function resetTimeout() {
    let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(user.id));
    userguilds.forEach(guild => {
      console.log(`Updating: ${guild.name} (${guild.id})`)
      let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id);
      bot.db.prepare("UPDATE guilddata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
      bot.db.prepare("UPDATE guilddata SET totalvotes=? WHERE guildid=?").run(guildData.totalvotes + 1, guild.id);
      bot.db.prepare("UPDATE guilddata SET monthlyvotes=? WHERE guildid=?").run(guildData.monthlyvotes + 1, guild.id);
      // bot.monthlyvotes.set(guild.id, bot.monthlyvotes.get(guild.id) + 1)
      // bot.totalvotes.set(guild.id, bot.totalvotes.get(guild.id) + 1)
      // if (guildData.monthlyvotes % 10 === 0) {
      //   let fyrlex = bot.users.cache.get(bot.config.ownerid)
      //   let embed = new MessageEmbed()
      //     .setColor(bot.colors.green)
      //     .setDescription([
      //       `${bot.emoji.check} **${bot.totalvotes.get(guild.id)} Monthly Votes**`,
      //       ``,
      //       `**Voter:** ${user}/${user.tag} (${user.id})`,
      //       `**Guild:** ${guild.name} (${guild.id})`])
      //   fyrlex.send(embed).catch(e => { })
      // }
    });
    console.log(`☑️ Set 'hasvoted' to TRUE for ${userguilds.size} guilds for the user ${user.tag} (${user.id}).`)
    clearTimeout(timeout);
    startTimeout();
  }
  let votechannel = bot.channels.cache.get(bot.config.votechannel);
  let usertag = user.tag;
  let weekend = body.isWeekend ? body.isWeekend : `false`;
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Fyrlex#2740`])
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
      `*You can vote here @ ${bot.config.vote.dbl}*`])
  return votechannel.send(votemsg).catch(e => { });
}
module.exports.discordbotlist = async (bot, request) => {
  console.log(request.body)
}
module.exports.labs = async (bot, request) => {
  let body = request.body
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
  let votechannel = bot.channels.cache.get(bot.config.votechannel);
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Fyrlex#2740`])
  user.send(dm).catch(e => { });
  let votemsg = new MessageEmbed()
    .setColor(body.type === "test" ? bot.colors.red : bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Labs`)
    .setDescription([
      `**Voter:** ${unknown ? `<@${body.user}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote here @ ${bot.config.vote.dl}*`]);
  return votechannel.send(votemsg).catch(e => { });
}
module.exports.boats = async (bot, request) => {
  let body = request.body
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
  let dm = new MessageEmbed()
    .setColor(bot.colors.main)
    .setThumbnail(bot.user.displayAvatarURL({ format: "png" }))
    .setDescription([
      `Hey, ${user}! Thank you for voting for me :)`,
      ``,
      `Make sure to check out the [rewards](${bot.docs.ads}) I give for voting!`,
      ``,
      `- Fyrlex#2740`]);
  user.send(dm).catch(e => { });
  let votechannel = bot.channels.cache.get(bot.config.votechannel);
  let usertag = user.tag;
  let votemsg = new MessageEmbed()
    .setColor(body.type === "test" ? bot.colors.red : bot.colors.main)
    .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
    .setFooter(`Discord Boats`)
    .setDescription([
      `**User:** ${unknown ? `<@${body.user.id}>` : user} (${usertag})`,
      `**Voted For:** ${bot.user}`,
      ``,
      `*You can vote here @ ${bot.config.vote.db}*`]);
  return votechannel.send(votemsg).catch(e => { });
}