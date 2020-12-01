const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "voiceStateUpdate",
  run: async (bot, oldState, newState) => {
    let guild = bot.guilds.cache.get((newState.guild || oldState.guild).id);
    if (bot.voicechannels.has(guild.id)) {
      // console.log(`Guild In Voice Channels Collection`)
      // console.log(`Cate From Collection: ${category}`)
      let getchannel = await bot.channels.fetch((oldState.channel || newState.channel).id) || guild.channels.cache.get((oldState.channel || newState.channel).id)
      // console.log(`Joined: ${getchannel.id}`)
      // console.log(`Parent: ${getchannel.parentID}`)
      if (guild && getchannel.parentID === bot.voicechannels.get(guild.id)) {
        // console.log(`Channel Is In Parent`)
        let user = bot.users.cache.get(newState.member.user.id) || (await bot.users.fetch(newState.member.user.id));
        // if (guild.id === "610816275580583936") {
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get((newState.guild || oldState.guild).id);
        if (guildData.autovoicesystemready === 1) {
          // console.log("System Ready")
          let tempchannels = JSON.parse(guildData.tempchannels);
          let createchannels = JSON.parse(guildData.autovoicechannels);
          let parent = guildData.autovoicecategory;
          if (parent === "none" && createchannels.length === 0) return;
          if (!oldState.channel && !newState.channel) return;
          if (newState.channel && getchannel.parentID === parent) {
            let createarray = []
            createchannels.forEach((item, index) => {
              if (item.id !== "none") {
                createarray.push(item.id)
              }
            })
            let fromchannel = []
            let t = JSON.parse(guildData.tempchannels)
            t.forEach((item, index) => {
              fromchannel.push(item.id)
            })
            let match;
            if (oldState.channel) match = fromchannel.includes(oldState.channelID);
            if (createarray.includes(newState.channelID) && match) {
              newState.setChannel(null).catch(e => { });
            } else if (createarray.includes(newState.channelID) && !match) {
              if (bot.voicecooldown.has(user.id)) {
                return newState.setChannel(null).catch(e => { });
              }
              let vc = createchannels.find(i => i.id === newState.channelID);
              // console.log(`JOINED: ${JSON.stringify(vc)}`)
              let opts = {
                type: "voice",
                userLimit: vc.limit,
                parent: parent
              };
              let number
              if (vc.type === "Duo") {
                number = bot.duo + 0;
                bot.duo++;
              } else if (vc.type === "Trio") {
                number = bot.trio + 0;
                bot.trio++;
              } else if (vc.type === "Squad") {
                number = bot.squad + 0;
                bot.squad++;
              }
              let type = vc.type
              let voice = await guild.channels.create(`${type} ${number}`, opts);
              await newState.setChannel(voice.id);
              let newobject = {
                id: voice.id,
                type: type
              }
              let t = JSON.parse(guildData.tempchannels);
              t.push(newobject);
              bot.db.prepare("UPDATE guilddata SET tempchannels=? WHERE guildid=?").run(JSON.stringify(t), newState.guild.id);
              // console.log(`New Temp Channels:\n${JSON.stringify(t)}`)
              bot.voicecooldown.set(user.id, Date.now());
              // console.log(`Cooldown Started: ${guildData.autovoicecooldown * 1000}`)
              setTimeout(() => {
                bot.voicecooldown.delete(user.id);
                // console.log(`Cooldown Ended`)
              }, (guildData.autovoicecooldown * 1000));
            }
          }
          let createchannels1 = JSON.parse(guildData.autovoicechannels);
          let a = []
          createchannels1.forEach((item, index) => {
            if (item.id !== "none") {
              a.push(item.id);
            }
          })
          if (oldState.channel && !a.includes(oldState.channelID)) {
            // console.log(`Old Channel: ${oldState.channelID}`)
            let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get(newState.guild.id);
            let a = [];
            let t = JSON.parse(guildData.tempchannels);
            // console.log(`Current Temp: ${JSON.stringify(t)}`)
            t.forEach((item, index) => {
              a.push(item.id)
            })
            // console.log(`Possible Channels: ${JSON.stringify(a)}`)
            // console.log(`Old Channel: ${oldState.channelID}`)
            let match = a.includes(oldState.channelID);
            // console.log(`Match: ${match}`)
            if (match) {
              // function checkChannel(tempchannels) {
              if (oldState.channel.members.size <= 0) {
                // console.log("Old channel has no members")
                try {
                  let vc = tempchannels.find(i => i.id === oldState.channelID);
                  // console.log(`Found: ${JSON.stringify(vc)}`)
                  if (vc.type === "Duo") {
                    bot.duo--;
                  } else if (vc.type === "Trio") {
                    bot.trio--;
                  } else if (vc.type === "Squad") {
                    bot.squad--;
                  }
                  // console.log(`Channel Index: ${tempchannels.indexOf(vc)}`)
                  tempchannels.splice(tempchannels.indexOf(vc), 1);
                  bot.db.prepare("UPDATE guilddata SET tempchannels=? WHERE guildid=?").run(JSON.stringify(tempchannels), newState.guild.id);
                  // console.log(`New Temp: ${JSON.stringify(tempchannels)}`)
                  oldState.channel.delete("No one was left!");
                } catch (e) {
                  // console.log("Couldn't delete channel!");
                  console.error(e);
                }
              }
              // }
            }
          }
        } else return;
      }
    }
  }
}