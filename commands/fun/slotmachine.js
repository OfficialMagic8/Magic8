const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["sm", "slot", "slots"],
  category: "FUN",
  description: "Roll a slot machine!",
  emoji: "🎰",
  name: "slotmachine",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    const emojis = [bot.emoji.peach8, bot.emoji.pineapple8, bot.emoji.cherries8, bot.emoji.strawberry8, bot.emoji.grapes8, bot.emoji.tangerine8, bot.emoji.watermelon8, bot.emoji.redapple8, bot.emoji.banana8]
    let language = bot.utils.getLanguage(bot, guildData.language);
    let object = {
      guildid: message.guild.id,
      channelid: message.channel.id,
      tag: message.author.tag,
      starttime: Date.now()
    };
    let random1 = Math.floor(Math.random() * 101);
    let nslot1 = Math.floor(Math.random() * emojis.length);
    let slot1 = emojis[nslot1];
    let mslot1 = emojis[Math.floor(Math.random() * emojis.length)];
    let mslot2 = emojis[Math.floor(Math.random() * emojis.length)];
    let mslot3 = emojis[Math.floor(Math.random() * emojis.length)];
    let tslot1 = emojis[Math.floor(Math.random() * emojis.length)];
    let tslot2 = emojis[Math.floor(Math.random() * emojis.length)];
    let tslot3 = emojis[Math.floor(Math.random() * emojis.length)];
    let bslot1 = emojis[Math.floor(Math.random() * emojis.length)];
    let bslot2 = emojis[Math.floor(Math.random() * emojis.length)];
    let bslot3 = emojis[Math.floor(Math.random() * emojis.length)];
    let nslot2;
    let slot2;
    let nslot3;
    let slot3;
    if (random1 > 50) {
      nslot2 = nslot1;
      slot2 = slot1;
      let random2 = Math.floor(Math.random() * 101);
      if (random2 > 70) {
        nslot3 = nslot1;
        slot3 = slot1;
      } else {
        nslot3 = Math.floor(Math.random() * emojis.length);
        slot3 = emojis[nslot3];
      }
    } else {
      nslot2 = Math.floor(Math.random() * emojis.length);
      slot2 = emojis[nslot2];
      nslot3 = Math.floor(Math.random() * emojis.length);
      slot3 = emojis[nslot3];
    }
    if (bot.playingslotmachine.has(message.author.id)) {
      let embed = new MessageEmbed()
        .setDescription(bot.translate(bot, language, "slotmachine.alreadyplaying").join("\n")
          .replace(/{CROSS}/g, bot.emoji.cross)
          .replace(/{USER}/g, message.author))
        .setColor(bot.colors.red)
      return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
    }
    bot.playingslotmachine.set(message.author.id, object)
    let startingdescription = bot.translate(bot, language, "slotmachine.starting").join("\n")
      .replace(/{USER}/g, message.author)
      .replace(/{LOADING}/g, bot.emoji.loading)
      .replace(/{ARROW}/g, bot.emoji.arrowright)
    let slotEmbed = new MessageEmbed()
      .setAuthor(bot.translate(bot, language, "slotmachine.title").replace(/{USERNAME}/g, message.author.username), message.author.displayAvatarURL({ format: "png", dynamic: "true" }))
      .setColor(guildData.funcolor)
      .setDescription(startingdescription.replace(/{SPACE}/g, bot.emoji.emptyspace)
        .replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, tslot2).replace(/{TSLOT3}/g, tslot3)
        .replace(/{SLOT1}/g, mslot1).replace(/{SLOT2}/g, mslot2).replace(/{SLOT3}/g, mslot3)
        .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, bslot2).replace(/{BSLOT3}/g, bslot3))
    let slotMessage = await message.channel.send(slotEmbed).catch(e => {
      bot.playingslotmachine.delete(message.author.id)
      return bot.error(bot, message, language, e);
    })
    setTimeout(async () => {
      slotMessage.react("🔴").catch(e => { return bot.error(bot, message, language, e); });
      slotMessage.react("🕹️").catch(e => { return bot.error(bot, message, language, e); });
      let ffilter = (reaction, user) => !user.bot && user.id === message.author.id && reaction.emoji.name === "🔴"
      try {
        collected = await slotMessage.awaitReactions(ffilter, { max: 1, time: 10000, errors: ["time"] })
      } catch (e) { }
      let watingdescription = bot.translate(bot, language, "slotmachine.waiting").join("\n")
        .replace(/{USER}/g, message.author)
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{ARROW}/g, bot.emoji.arrowright)
      slotEmbed.setDescription(watingdescription.replace(/{SPACE}/g, bot.emoji.emptyspace)
        .replace(/{TSLOT1}/g, bot.emoji.slot3).replace(/{TSLOT2}/g, bot.emoji.slot6).replace(/{TSLOT3}/g, bot.emoji.slot9)
        .replace(/{SLOT1}/g, bot.emoji.slot2).replace(/{SLOT2}/g, bot.emoji.slot5).replace(/{SLOT3}/g, bot.emoji.slot8)
        .replace(/{BSLOT1}/g, bot.emoji.slot1).replace(/{BSLOT2}/g, bot.emoji.slot4).replace(/{BSLOT3}/g, bot.emoji.slot7))
      try {
        await slotMessage.edit(slotEmbed)
      } catch (e) {
        bot.playingslotmachine.delete(message.author.id)
        return bot.error(bot, message, language, e);
      }
      const filter = (reaction, user) => !user.bot && user.id === message.author.id && reaction.emoji.name === "🕹️"
      let collected;
      try {
        collected = await slotMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
      } catch (e) { }
      let slot = 2
      let stoppingdescription = bot.translate(bot, language, "slotmachine.rollandstop").join("\n")
        .replace(/{USER}/g, message.author)
        .replace(/{LOADING}/g, bot.emoji.loading)
        .replace(/{ARROW}/g, bot.emoji.arrowright)
        .replace(/{SPACE}/g, bot.emoji.emptyspace)
      let tempstoppingdescription = stoppingdescription.replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, bot.emoji.slot6).replace(/{TSLOT3}/g, bot.emoji.slot9)
        .replace(/{SLOT1}/g, slot1).replace(/{SLOT2}/g, bot.emoji.slot5).replace(/{SLOT3}/g, bot.emoji.slot8)
        .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, bot.emoji.slot4).replace(/{BSLOT3}/g, bot.emoji.slot7);
      slotEmbed.setDescription(tempstoppingdescription)
        .setColor("YELLOW")
      try {
        await slotMessage.edit(slotEmbed)
      } catch (e) {
        bot.playingslotmachine.delete(message.author.id)
        return bot.error(bot, message, language, e);
      }
      let interval = setInterval(async () => {
        let tempstoppingdescription;
        if (slot === 1) {
          tempstoppingdescription = stoppingdescription.replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, bot.emoji.slot6).replace(/{TSLOT3}/g, bot.emoji.slot9)
            .replace(/{SLOT1}/g, slot1).replace(/{SLOT2}/g, bot.emoji.slot5).replace(/{SLOT3}/g, bot.emoji.slot8)
            .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, bot.emoji.slot4).replace(/{BSLOT3}/g, bot.emoji.slot7);
        } else if (slot === 2) {
          tempstoppingdescription = stoppingdescription.replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, `${tslot2}`).replace(/{TSLOT3}/g, bot.emoji.slot7)
            .replace(/{SLOT1}/g, slot1).replace(/{SLOT2}/g, `${slot2}`).replace(/{SLOT3}/g, bot.emoji.slot8)
            .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, `${bslot2}`).replace(/{BSLOT3}/g, bot.emoji.slot9);
        } else {
          tempstoppingdescription = stoppingdescription.replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, tslot2).replace(/{TSLOT3}/g, tslot3)
            .replace(/{SLOT1}/g, slot1).replace(/{SLOT2}/g, slot2).replace(/{SLOT3}/g, slot3)
            .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, bslot2).replace(/{BSLOT3}/g, bslot3);
        }
        slotEmbed.setDescription(tempstoppingdescription)
          .setColor("GOLD")
        slot = slot + 1;
        try {
          await slotMessage.edit(slotEmbed)
        } catch (e) {
          return bot.error(bot, message, language, e);
        }
        if (slot > 3) {
          setTimeout(() => {
            let win = (nslot1 === nslot2 && nslot2 === nslot3)
            // console.log(`🎰[${win ? "✔️" : "❌"}] ${message.author.tag} ${win ? "won" : "lost"} in slot machine! (${slot1}${slot2}${slot3})`);
            bot.playingslotmachine.delete(message.author.id);
            slotMessage.reactions.removeAll().catch(e => {
              return bot.error(bot, message, language, e);
            });
            let finaldescription = bot.translate(bot, language, `slotmachine.${win ? "win" : "lose"}`).join("\n")
              .replace(/{CROSS}/g, bot.emoji.cross)
              .replace(/{CHECK}/g, bot.emoji.check)
              .replace(/{USER}/g, message.author)
              .replace(/{LOADING}/g, bot.emoji.loading)
              .replace(/{TSLOT1}/g, tslot1).replace(/{TSLOT2}/g, tslot2).replace(/{TSLOT3}/g, tslot3)
              .replace(/{SLOT1}/g, slot1).replace(/{SLOT2}/g, slot2).replace(/{SLOT3}/g, slot3)
              .replace(/{BSLOT1}/g, bslot1).replace(/{BSLOT2}/g, bslot2).replace(/{BSLOT3}/g, bslot3)
              .replace(/{ARROW}/g, bot.emoji.arrowright)
              .replace(/{SPACE}/g, bot.emoji.emptyspace)
            slotEmbed.setDescription(finaldescription)
              .setColor(win ? bot.colors.green : bot.colors.red);
            slotMessage.edit(slotEmbed).then(m => {
              bot.playingslotmachine.delete(message.author.id);
            }).catch(e => {
              bot.playingslotmachine.delete(message.author.id);
              slotMessage.delete({ timeout: 500 }).catch(e => { });
              return bot.error(bot, message, language, e);
            })
          }, 2000)
          clearInterval(interval);
        }
      }, 3000)
    }, 1000)
  }
}