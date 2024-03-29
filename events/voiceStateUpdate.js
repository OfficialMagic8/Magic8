const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "voiceStateUpdate",
  run: async (bot, oldState, newState) => {
    let guild = bot.guilds.cache.get((newState.guild || oldState.guild).id);
    if (bot.avcategories.has(guild.id)) {
      // console.log(`Guild In Voice Channels Collection`)
      let getchannel;
      try {
        getchannel = guild.channels.cache.get((oldState.channel || newState.channel).id) || await guild.channels.fetch((oldState.channel || newState.channel).id)
      } catch (e) { return }
      // console.log(`Joined: ${getchannel.id}`)
      // console.log(`Parent: ${getchannel.parentID}`)
      if (guild && getchannel.parentID === bot.avcategories.get(guild.id)) {
        // console.log(`Channel Is In Parent`)
        let user;
        try {
          user = bot.users.cache.get(newState.member.user.id) || await bot.users.fetch(newState.member.user.id);
        } catch (e) { }  // if (guild.id === "610816275580583936") {
        let guildData = bot.db.prepare("SELECT * FROM guilddata WHERE guildid=?").get((newState.guild || oldState.guild).id);
        if (guildData.autovoicesystemready === 1) {
          // console.log("System Ready")
          // let tempchannels = JSON.parse(guildData.tempchannels);
          if (!bot.avtempchannels.has(guild.id)) bot.avtempchannels.set(guild.id, []);
          let tempchannels = bot.avtempchannels.get(guild.id)
          let createchannels = JSON.parse(guildData.autovoicechannels);
          let parent = guildData.autovoicecategory;
          if (parent === "none" && createchannels.length === 0) return;
          if (!oldState.channel && !newState.channel) return;
          if (newState.channel && getchannel.parentID === parent) {
            let createarray = []
            createchannels.forEach(channel => {
              if (channel.id !== "none") {
                createarray.push(channel.id);
              }
            })
            let fromchannel = [];
            tempchannels.forEach(tempchannel => {
              fromchannel.push(tempchannel.id);
            });
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
              let type = vc.type;
              if (!bot[`${type}`].has(guild.id)) bot[`${type}`].set(guild.id, 0);
              bot[`${type}`].set(guild.id, bot[`${type}`].get(guild.id) + 1);
              let number = bot[`${type}`].get(guild.id);
              let name = guildData[`${type.toLowerCase()}name`];
              let voice = await guild.channels.create(name.replace(/{NUMBER}/g, number), opts);
              await newState.setChannel(voice.id).catch(e => { });
              let newobject = {
                id: voice.id,
                type: type
              };
              let t = bot.avtempchannels.get(guild.id);
              t.push(newobject);
              bot.avtempchannels.set(guild.id, t);
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
          createchannels1.forEach(channel => {
            if (channel.id !== "none") {
              a.push(channel.id);
            }
          })
          if (oldState.channel && !a.includes(oldState.channelID)) {
            // console.log(`Old Channel: ${oldState.channelID}`)
            let array = [];
            let t = bot.avtempchannels.get(guild.id);
            // console.log(`Current Temp: ${JSON.stringify(t)}`)
            t.forEach(channel => {
              array.push(channel.id);
            });
            // console.log(`Possible Channels: ${JSON.stringify(a)}`)
            // console.log(`Old Channel: ${oldState.channelID}`)
            let match = array.includes(oldState.channelID);
            // console.log(`Match: ${match}`)
            if (match) {
              // function checkChannel(tempchannels) {
              if (oldState.channel.members.size <= 0) {
                // console.log("Old channel has no members")
                try {
                  let vc = t.find(i => i.id === oldState.channelID);
                  // console.log(`Found: ${JSON.stringify(vc)}`)
                  bot[`${vc.type}`].set(guild.id, bot[`${vc.type}`].get(guild.id) - 1);
                  // console.log(`Channel Index: ${tempchannels.indexOf(vc)}`)
                  t.splice(t.indexOf(vc), 1);
                  bot.avtempchannels.set(guild.id, t);
                  // console.log(`New Temp: ${JSON.stringify(tempchannels)}`)
                  await oldState.channel.delete("No one was left!");
                } catch (e) {
                  return console.error(e);
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