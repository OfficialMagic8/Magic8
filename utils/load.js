module.exports.loadEmojis = (bot) => {
  let mse = ["Magic8 Support Emojis"];
  let pbe = ["PB Emojis"];
  let me = ["Magic8 Emojis"];
  bot.guilds.cache.get(bot.supportserver).emojis.cache.forEach(emoji => {
    mse.push(`${emoji.name}: "<:${emoji.identifier}>",`);
  })
  bot.guilds.cache.get("499336772468342784").emojis.cache.forEach(emoji => {
    pbe.push(`${emoji.name}: "<:${emoji.identifier}>",`);
  })
  bot.guilds.cache.get("710181950559748178").emojis.cache.forEach(emoji => {
    me.push(`${emoji.name}: "<:${emoji.identifier}>",`);
  })
  bot.hastebin(`${mse.join("\n")}\n\n${pbe.join("\n")}\n\n${me.join("\n")}`, { url: "https://paste.mod.gg", extension: "txt" }).then(haste => {
    console.log(`😜 Emoji List: ${haste}`)
  }).catch(e => { });
};
module.exports.loadMain = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = bot.db.prepare("SELECT * FROM guilddata").all().filter(row => guildsids.includes(row.guildid));
  loaded.forEach(row => {
    bot.prefixes.set(row.guildid, row.prefix);
    bot.premium.set(row.guildid, row.premium);
  });
};
module.exports.loadMCServers = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = bot.db.prepare("SELECT * FROM guilddata WHERE mcserverip!=?").all("none").filter(row => guildsids.includes(row.guildid));
  loaded.forEach(row => {
    bot.mcservers.set(row.guildid, row.mcserverip);
  });
};
module.exports.loadMonthlyVotes = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = bot.db.prepare("SELECT * FROM guilddata WHERE monthlyvotes!=?").all(0).filter(row => guildsids.includes(row.guildid));
  loaded.forEach(row => {
    bot.monthlyvotes.set(row.guildid, row.monthlyvotes)
  })
  console.log(`☑️ Guilds with monthly votes: ${loaded.length}`);
};
module.exports.loadTotalVotes = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = bot.db.prepare("SELECT * FROM guilddata WHERE totalvotes!=?").all(0).filter(row => guildsids.includes(row.guildid));
  loaded.forEach(row => {
    bot.totalvotes.set(row.guildid, row.totalvotes);
  });
  console.log(`☑️ Guilds with any votes: ${loaded.length}`);
};
module.exports.loadVotedUsers = async (bot) => {
  try {
    let votes = await bot.dbl.getVotes();
    let voted = [];
    votes.forEach(vote => {
      let o = {
        name: `${vote.username}#${vote.discriminator}`,
        id: vote.id,
        votes: 1
      }
      voted.push(o);
    });
    let names = [];
    let votesarray = [];
    let idarray = []
    for (let v of voted) {
      let repeats = voted.filter(i => i.name === v.name);
      names.push(v.name)
      if (names.filter(i => i === v.name).length <= 1) {
        let o = {
          name: v.name,
          id: v.id,
          votes: repeats.length
        }
        votesarray.push(o)
        idarray.push(v.id)
      }
    }
    console.log(`☑️ Loaded ${votesarray.length} DBL Voters This Month`);
    idarray.forEach(userid => {
      let userguilds = bot.guilds.cache.filter(guild => guild.members.cache.has(userid));
      userguilds.forEach(guild => {
        let current = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(guild.id).monthlyvotes
        bot.db.prepare("UPDATE guilddata SET monthlyvotes=? WHERE guildid=?").run(current + votesarray.find(v => v.id === userid).votes, guild.id);
      });
      if (bot.dbl.hasVoted(userid)) {
        userguilds.forEach(guild => {
          bot.db.prepare("UPDATE guilddata SET hasvoted=? WHERE guildid=?").run("true", guild.id);
        });
      } else if (!bot.dbl.hasVoted(userid)) {
        userguilds.forEach(guild => {
          bot.db.prepare("UPDATE guilddata SET hasvoted=? WHERE guildid=?").run("false", guild.id);
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
};
module.exports.loadAutoVoiceChannels = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = bot.db.prepare("SELECT * FROM guilddata WHERE autovoicesystemready!=?").all(0).filter(row => guildsids.includes(row.guildid));
  loaded.forEach(row => {
    let category = row.autovoicecategory
    if (bot.guilds.cache.get(row.guildid).channels.cache.has(category)) {
      bot.voicechannels.set(row.guildid, category)
      let channels = JSON.parse(row.autovoicechannels)
      let a = []
      channels.forEach(c => {
        if (bot.guilds.cache.get(row.guildid).channels.cache.has(c.id)) {
          a.push(c.id)
        } else if (!bot.guilds.cache.get(row.guildid).channels.cache.has(c.id)) {
          let v = channels.find(i => i.id === c.id)
          channels.splice(channels.indexOf(v))
        }
      })
      if (a.length <= 0) {
        bot.db.prepare("UPDATE guilddata SET autovoicesystemready=? WHERE guildid=?").run(0, row.guildid)
      }
      bot.db.prepare("UPDATE guilddata SET autovoicechannels=? WHERE guildid=?").run(JSON.stringify(channels), row.guildid);
    }
  })
  console.log(`🔊 Guilds with Auto Voice Channels Ready: ${loaded.length}`)
};
module.exports.loadLFGRoles = async (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let lfgroleguilds = bot.db.prepare("SELECT * FROM guilddata WHERE lfgrole!=?").all("none").filter(row => guildsids.includes(row.guildid))
  lfgroleguilds.forEach(row => {
    let role = row.lfgrole;
    if (bot.guilds.cache.get(row.guildid).roles.cache.has(role)) {
      bot.lfgroles.set(row.guildid, role);
    }
  })
  console.log(`🎮 Guilds with LFG Roles: ${lfgroleguilds.length}`)
};
module.exports.loadLFGNotificationChannels = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let lfgchannelguilds = bot.db.prepare("SELECT * FROM guilddata WHERE lfgnotifychannel!=?").all("none").filter(row => guildsids.includes(row.guildid))
  lfgchannelguilds.forEach(row => {
    let channel = row.lfgnotifychannel
    if (bot.guilds.cache.get(row.guildid).channels.cache.has(channel)) {
      bot.lfgnotifychannels.set(row.guildid, channel)
    }
  })
  console.log(`🎮 Guilds with LFG Notification Channel: ${lfgchannelguilds.length}`)
};
module.exports.loadRestrictedChannels = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let loaded = []
  let funguilds = bot.db.prepare("SELECT * FROM guilddata WHERE funchannel!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  funguilds.forEach(row => {
    let finalchannels = []
    JSON.parse(row.funchannel).forEach(c => {
      finalchannels.push(c)
    })
    if (!loaded.includes(row.guildid)) {
      loaded.push(row.guildid)
    }
    bot.funchannels.set(row.guildid, finalchannels)
  })
  let miniguilds = bot.db.prepare("SELECT * FROM guilddata WHERE minigamechannel!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  miniguilds.forEach(row => {
    let finalchannels = []
    JSON.parse(row.minigamechannel).forEach(c => {
      finalchannels.push(c)
    })
    if (!loaded.includes(row.guildid)) {
      loaded.push(row.guildid)
    }
    bot.minigamechannels.set(row.guildid, finalchannels)
  })
  let miscguilds = bot.db.prepare("SELECT * FROM guilddata WHERE miscellaneouschannel!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  miscguilds.forEach(row => {
    let finalchannels = []
    JSON.parse(row.miscellaneouschannel).forEach(c => {
      finalchannels.push(c)
    })
    if (!loaded.includes(row.guildid)) {
      loaded.push(row.guildid)
    }
    bot.miscellaneouschannels.set(row.guildid, finalchannels)
  })
  let reactionguilds = bot.db.prepare("SELECT * FROM guilddata WHERE reactionchannel!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  reactionguilds.forEach(row => {
    let finalchannels = []
    JSON.parse(row.reactionchannel).forEach(c => {
      finalchannels.push(c)
    })
    if (!loaded.includes(row.guildid)) {
      loaded.push(row.guildid)
    }
    bot.reactionchannels.set(row.guildid, finalchannels)
  })
  console.log(`🚫 Guilds with Restricted Channels: ${loaded.length}`)
};
module.exports.loadAntiPingUsers = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let antipingguilds = bot.db.prepare("SELECT * FROM guilddata WHERE antipingusers!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  antipingguilds.forEach(row => {
    let users = [];
    JSON.parse(row.antipingusers).forEach(c => {
      users.push(c);
    })
    bot.antipingusers.set(row.guildid, users)
  })
  console.log(`🏷️ Guilds with Anti-Ping Users: ${antipingguilds.length}`)
};
module.exports.loadAntiPingChannels = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let antipinglogguilds = bot.db.prepare("SELECT * FROM guilddata WHERE antipinglogchannel!=?").all("none").filter(row => guildsids.includes(row.guildid))
  antipinglogguilds.forEach(row => {
    bot.antipinglogchannels.set(row.guildid, row.antipinglogchannel)
  })
  console.log(`🏷️ Guilds with Anti-Ping Log Channels: ${antipinglogguilds.length}`)
};
module.exports.loadAntiPingRoles = async (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let apbypassroleguilds = bot.db.prepare("SELECT * FROM guilddata WHERE antipingbypassroles!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  apbypassroleguilds.forEach(row => {
    let roles = [];
    JSON.parse(row.antipingbypassroles).forEach(role => {
      if (bot.guilds.cache.get(row.guildid).roles.cache.has(role)) {
        roles.push(role);
      }
    });
    bot.antipingbypassroles.set(row.guildid, roles);
  });
  console.log(`🏷️ Guilds with Anti-Ping Bypass Roles: ${apbypassroleguilds.length}`)
};
module.exports.loadDisabledCommands = (bot) => {
  let guildsids = bot.guilds.cache.keyArray();
  let disabledcommandsguilds = bot.db.prepare("SELECT * FROM guilddata WHERE disabledcommands!=?").all("[]").filter(row => guildsids.includes(row.guildid))
  disabledcommandsguilds.forEach(row => {
    bot.disabledcommands.set(row.guildid, row.disabledcommands)
  })
  console.log(`🚫 Guilds with Disabled Commands: ${disabledcommandsguilds.length}`)
};
// module.exports.loadLanguageProgress = (bot) => {
//   let langEnPathsAmount = bot.utils.getAllPaths(bot.languages.get("en")).length;
//   let langArray = ["🌎 Languages: en"];
//   bot.languages.forEach((object, lang) => {
//     if (lang !== "en") {
//       let paths = bot.utils.getAllPaths(object);
//       let progress = (paths.length * 100) / langEnPathsAmount;
//       progress = progress.toFixed(2);
//       langArray.push(`| ${lang}`)
//       bot.languagesprogress.set(lang, { lang: object.languagenamelong, flag: object.flag, progress: progress, authors: object.authors, link: object.link })
//     }
//   })
//   bot.languagesprogress.sort(function (a, b) {
//     return b.progress - a.progress;
//   });
//   console.log(`Loaded Language Progress:`);
//   console.log(langArray.join(" "));
// };
// const updateDiscordBotList() {
//   updateServers();
//   setInterval(() => {
//     updateServers();
//   }, 1800000)
// }
// const updateServers() {
//   console.log("🤖 Posted guild count in Discord Bot List!")
//   bot.dbl.postStats(bot.guilds.cache.size).catch(e => { });
// }
// let freespace = true;
// const runGitCommands = (bot) => {
//   console.log(`🔷 Freeing space for ${bot.user.tag}${freespace ? "" : " (CANCELLED)"}`)
//   if (!freespace) return;
//   childprocess.exec("git prune", (err, stdout, stderr) => {
//     if (err) {
//       log.error(`exec error: ${err}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.error(`stderr: ${stderr}`);
//   });
//   setTimeout(() => {
//     childprocess.exec("git gc", (err, stdout, stderr) => {
//       if (err) {
//         console.error(`exec error: ${err}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//       console.error(`stderr: ${stderr}`);
//     });
//   }, 5000);
// }