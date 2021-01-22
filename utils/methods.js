const { MessageEmbed } = require("discord.js");
module.exports.loadDatabases = (bot) => {
  const Database = require('better-sqlite3');
  bot.db = new Database('./data/guildData.db');
  bot.udb = new Database('./data/usageData.db');
  bot.vdb = new Database('./data/voteData.db')
  console.log("📊 Databases fetched!")
}
module.exports.loadCommands = (bot) => {
  try {
    let reloading = false;
    if (bot.commands.size >= 1) {
      bot.commands.clear();
      reloading = true;
    }
    console.log(`💻 ${reloading ? `Rel` : `L`}oading commands...`)
    bot.fs.readdirSync("./commands/").forEach(dir => {
      if (!dir.includes(".js")) {
        bot.fs.readdir(`./commands/${dir}`, (err, files) => {
          if (err) console.error(err);
          const commands = files.filter(f => f.split(".").pop() === "js");
          for (let file of commands) {
            if (reloading) delete require.cache[require.resolve(`../commands/${dir}/${file}`)];
            let pull = require(`../commands/${dir}/${file}`);
            if (!pull) continue;
            if (pull.name) {
              bot.commands.set(pull.name, pull);
            } else continue;
            if (pull.aliases) {
              pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
            }
          }
        });
      }
    });
    console.log(`💻 Commands ${reloading ? `re` : ``}loaded successfully!`);
  } catch (e) {
    console.error(`Couldn't Load Commands`)
    console.error(e);
  }
}
module.exports.loadEvents = (bot) => {
  try {
    let reloading = false;
    if (bot.events.size >= 1) {
      reloading = true;
      bot.events.clear();
    }
    bot.fs.readdir("./events/", (err, files) => {
      if (err) console.error(err);
      console.log(`📢 ${reloading ? `Rel` : `L`}oading events...`)
      const events = files.filter(f => f.split(".").pop() === "js")
      for (let file of events) {
        if (reloading) delete require.cache[require.resolve(`../events/${file}`)];
        let pull = require(`../events/${file}`);
        if (!pull) continue;
        if (pull.name) {
          bot.events.set(pull.name, pull);
        } else continue;
      }
      console.log(`📢 Events ${reloading ? `re` : ``}loaded successfully!`);
    })
  } catch (e) {
    console.error(`Couldn't Load Events`)
    console.error(e);
  }
}

let thisclass = this;
module.exports.fetchMessages = async (fetchedMessages, channel) => {
  return await fetchMessages(fetchedMessages, channel);
}
async function fetchMessages(fetchedMessages, channel) { // long time no glitch.com ikr
  if (!fetchedMessages) {
    fetchedMessages = await channel.messages.fetch({ limit: 100 }); // Here you should have changed xd
    console.log(`Fetched ${fetchedMessages.size} messages!`) // this is correct or no? no yes // restart then good?no xd probably more like this here xd
    if (fetchedMessages.size < 100) {
      return fetchedMessages;
    }
  }
  if (fetchedMessages.size <= 0) return fetchedMessages;
  let lastmessageid = fetchedMessages.array()[fetchedMessages.size - 1].id;
  let newFetchedMessages = await channel.messages.fetch({ limit: 100, before: lastmessageid });
  if (newFetchedMessages.size <= 0) return fetchedMessages;
  console.log(`Fetched ${newFetchedMessages.size} messages!`)
  if (newFetchedMessages.size >= 100) {
    return await fetchMessages(fetchedMessages.concat(newFetchedMessages), channel);
  } else {
    return fetchedMessages.concat(newFetchedMessages);
  }
}
module.exports.error = (bot, message, language, e) => {
  let logs = bot.guilds.cache.get(bot.supportserver).channels.cache.get(bot.config.caughterrors);
  let startedwith;
  let prefix = bot.prefixes.get(message.guild.id)
  if (message.content.startsWith(prefix)) startedwith = prefix.length
  if (message.content.startsWith(`<@${bot.user.id}>`)) startedwith = `<@${bot.user.id}>`.length;
  if (message.content.startsWith(`<@!${bot.user.id}>`)) startedwith = `<@!${bot.user.id}>`.length;
  let args = message.content.slice(startedwith).trim().split(" ");
  let input = args.shift().toLowerCase();
  let command;
  if (bot.commands.has(input)) {
    command = bot.commands.get(input);
  } else if (bot.aliases.has(input)) {
    command = bot.commands.get(bot.aliases.get(input));
  } else return;
  let errormessage = [
    `\`\`\`xl`,
    `Caught Error @ ${input}/${command.name}:`,
    `${e.stack}`,
    `\`\`\``
  ];
  logs.send(errormessage).catch(e => { });
  let embederror = bot.translate(bot, language, "embederror").join("\n")
    .replace(/{CROSS}/g, bot.emoji.cross)
    .replace(/{USER}/g, message.author)
    .replace(/{BOT}/g, bot.user)
    .replace(/{PERMISSIONS}/g, bot.docs.permissions)
    .replace(/{INFO}/g, bot.emoji.info)
    .replace(/{INVITE}/g, bot.invite)
  let regularerror = bot.translate(bot, language, "messageerror").join("\n")
    .replace(/{CROSS}/g, bot.emoji.cross)
    .replace(/{USER}/g, message.author)
    .replace(/{BOT}/g, bot.user)
    .replace(/{PERMISSIONS}/g, bot.docs.permissions)
    .replace(/{INFO}/g, bot.emoji.info)
    .replace(/{SHORTINVITE}/g, bot.shortinvite)
  let embed = new MessageEmbed()
    .setColor(bot.colors.red)
    .setDescription(embederror);
  return message.channel.send(embed).catch(e => {
    return message.channel.send(regularerror).catch(e => { });
  });
}
module.exports.loadLanguageProgress = (bot) => {
  let langEnPathsAmount = bot.utils.getAllPaths(bot.languages.get("en")).length;
  let langArray = ["🌎 Languages: en"];
  bot.languages.forEach((object, lang) => {
    if (lang !== "en") {
      let paths = bot.utils.getAllPaths(object);
      let progress = (paths.length * 100) / langEnPathsAmount;
      progress = progress.toFixed(2);
      langArray.push(`| ${lang}`);
      bot.languagesprogress.set(lang, { lang: object.languagenamelong, flag: object.flag, progress: progress, authors: object.authors });
    };
  });
  bot.languagesprogress.sort(function (a, b) {
    return b.progress - a.progress;
  });
  console.log(`Loaded Language Progress:`);
  console.log(langArray.join(" "));
};
module.exports.fetchLanguages = (bot) => {
  bot.lastfetched.set("lf", new Date().toLocaleString("en"))
  bot.fetch("https://raw.githubusercontent.com/OfficialMagic8/Languages/master/links.json").then(res => res.json()).then(json => {
    json.forEach(link => {
      bot.fetch(link).then(res => res.json()).then(json => {
        bot.languages.set(json.languagenameshort, json);
      });
    });
  }).catch(e => { return bot.error(bot, message, language, e); });
}
module.exports.getTranslation = (bot, object, path) => {
  let text = getNested(object, path.split("."));
  return typeof text === "undefined" ? getNested(bot.languages.get("en"), path.split(".")) : text;
}
module.exports.getLanguage = (bot, lang = "en") => {
  return bot.languages.has(lang) ? bot.languages.get(lang) : bot.languages.get("en");
}
module.exports.registerGuild = (bot, guild) => {
  bot.db.prepare("INSERT INTO guilddata (guildid, guildname) VALUES (?,?)").run(guild.id, guild.name);
}
module.exports.updateGuild = (bot, guild) => {
  bot.db.prepare("UPDATE guilddata SET guildname=? WHERE guildid=?").run(guild.name, guild.id);
  bot.db.prepare("UPDATE guilddata SET inguild=? WHERE guildid=?").run("true", guild.id);
}
module.exports.registerGuildVotes = (bot, guild) => {
  bot.vdb.prepare("INSERT INTO votedata (guildid, guildname) VALUES (?,?)").run(guild.id, guild.name);
}
module.exports.updateGuildVotes = (bot, guild) => {
  bot.vdb.prepare("UPDATE votedata SET guildname=? WHERE guildid=?").run(guild.name, guild.id);
  bot.vdb.prepare("UPDATE votedata SET inguild=? WHERE guildid=?").run("true", guild.id);
}
module.exports.registerGuildUsage = (bot, guild) => {
  bot.udb.prepare("INSERT INTO usagedata (guildid, guildname) VALUES (?,?)").run(guild.id, guild.name)
  bot.usage.set(guild.id, 0)
  bot.adtype.set(guild.id, 0);
}
module.exports.updateGuildUsage = (bot, guild) => {
  bot.udb.prepare("UPDATE usagedata SET guildname=? WHERE guildid=?").run(guild.name, guild.id)
  bot.udb.prepare("UPDATE usagedata SET inguild=? WHERE guildid=?").run("true", guild.id);
}
module.exports.getRandomColors = (bot, amount) => {
  let object = bot.color8;
  let keys = Object.keys(object)
  if (keys.length <= 0 || amount <= 0) return "";
  let random = "";
  let randomoriginal = "";
  if (amount <= keys.length + 1) {
    var currentIndex = keys.length, temporaryValue, randomIndex;
    let tempkeys = keys.slice();
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = tempkeys[currentIndex];
      tempkeys[currentIndex] = tempkeys[randomIndex];
      tempkeys[randomIndex] = temporaryValue;
    }
    let finalkeys = tempkeys.slice(0, amount - 1)
    for (let key of finalkeys) {
      let value = object[key]
      random += key;
      randomoriginal += value
    }
  } else {
    for (let i = 1; i <= amount; i++) {
      let key = keys[Math.floor(Math.random() * keys.length)]
      let value = object[key]
      random += key;
      randomoriginal += value
    }
  }
  let newObject = {
    original: random,
    correct: randomoriginal
  }
  return newObject;
}
function getNested(obj, args) {
  return args.reduce((obj, level) => obj && obj[level], obj)
}
module.exports.getAllPaths = (object) => {
  let paths = [];
  getPaths(object, paths, "")
  return paths;
}
function getPaths(object, paths, currentpath) {
  if (typeof object !== 'object') {
    paths.push(currentpath);
  } else {
    if (Array.isArray(object)) {
      paths.push(currentpath);
    } else {
      let keys = Object.keys(object);
      for (let key of keys) {
        getPaths(object[key], paths, currentpath.length === 0 ? key : `${currentpath}.${key}`)
      }
    }
  }
}
module.exports.UUIDfromString = (string) => {
  const HYPHENS_POSITIONS = [20, 16, 12, 8];
  let array = string.split("");
  for (let i of HYPHENS_POSITIONS)
    array.splice(i, 0, "-");
  return array.join("")
}
// const { MessageEmbed } = require("discord.js");
// const permsToDeny = ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"]
// const permsForCreator = ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"]
// const permsForSupport = ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "MANAGE_MESSAGES"]
// const permsForBot = ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
// module.exports.attemptOpenTicket = async (bot, guild, member, category, language, guildData, currentticket, channel) => {
//   let newTicketName = `ticket-${member.id}-${currentticket}`;
//   let ticketChannel;
//   let perms = [];
//   perms.push({ id: member.guild.id, deny: permsToDeny });
//   perms.push({ id: member.id, allow: permsForCreator });
//   let supportRole = member.guild.roles.cache.get(guildData.ticketsupportroleid);
//   if (supportRole) perms.push({ id: supportRole.id, allow: permsForSupport });
//   perms.push({ id: bot.user.id, allow: permsForBot });
//   try {
//     ticketChannel = await member.guild.channels.create(newTicketName, { type: "text", permissionOverwrites: perms, parent: category.id });
//   } catch (e) {
//     let error = new MessageEmbed()
//       .setColor(bot.colors.red)
//       .setDescription(bot.translate(bot, language, "ticket.new.errorcreating").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
//         .replace(/{INFO}/g, bot.emoji.info))
//     if (channel) {
//       channel.send(error).then(m => m.delete({ timeout: 15000 }).catch(e => { });)
//     } else {
//       member.send(error).catch(e => { });
//     }
//     return;
//   }
//   let messageToTicket = guildData.ticketmessage
//   if (messageToTicket === "none") {
//     ticketChannel.send(bot.translate(bot, language, "ticket.new.newticketdefault").join("\n").replace(/{CHECK}/g, bot.emoji.check).replace(/{USER}/g, member.user)).catch(e => { });
//   } else {
//     let supportRoleMetion = supportRole ? supportRole : "`Not selected`"
//     messageToTicket = messageToTicket.replace(/{EVERYONE}/gi, "@everyone").replace(/{HERE}/gi, "@here").replace(/{SUPPORTROLE}/gi, supportRoleMetion).replace(/{USER}/gi, member.user)
//     ticketChannel.send(messageToTicket).catch(e => { });
//   }
//   let ticketslog = member.guild.channels.cache.get(guildData.ticketslogchannelid)
//   if (ticketslog) {
//     let created = new MessageEmbed()
//       .setColor(bot.colors.green)
//       .setAuthor(bot.translate(bot, language, "ticket.new.created.title"), "https://cdn.discordapp.com/emojis/690971832387502180.png")
//       .setDescription(bot.translate(bot, language, "ticket.new.created.description").join("\n").replace(/{CROSS}/g, bot.emoji.cross)
//         .replace(/{CREATOR}/g, member.user).replace(/{CREATORID}/g, member.id)
//         .replace(/{CREATIONDATE}/g, (new Date()).toLocaleString().split("GMT")[0].trim())
//         .replace(/{TICKETCHANNEL}/g, ticketChannel).replace(/{TICKETCHANNELID}/g, ticketChannel.id)
//         .replace(/{INFO}/g, bot.emoji.info))
//     ticketslog.send(created).catch(e => { });
//   }
// }
var pseudoRandom = Math.random;

var visaPrefixList = new Array(
  "4539",
  "4556",
  "4916",
  "4532",
  "4929",
  "40240071",
  "4485",
  "4716",
  "4"
);

var mastercardPrefixList = new Array(
  "51",
  "52",
  "53",
  "54",
  "55"
);

var amexPrefixList = new Array(
  "34",
  "37"
);

var discoverPrefixList = new Array("6011");

var dinersPrefixList = new Array(
  "300",
  "301",
  "302",
  "303",
  "36",
  "38"
);

var enRoutePrefixList = new Array(
  "2014",
  "2149"
);

var jcbPrefixList = new Array(
  "35"
);

var voyagerPrefixList = new Array("8699");

/**
 * Revert a String
 * @param  {String} str
 * @return {String}
 */
function strrev(str) {
  if (!str) return '';
  var revstr = '';
  for (var i = str.length - 1; i >= 0; i--)
    revstr += str.charAt(i)
  return revstr;
}

/**
 * Complete a prefixed number-string
 * @param  {String} prefix  is the start of the CC number as a string, any number of digits
 * @param  {Number} length  is the length of the CC number to generate. Typically 13 or 16
 * @return {String}
 */
function completed_number(prefix, length) {

  var ccnumber = prefix;

  // generate digits

  while (ccnumber.length < (length - 1)) {
    ccnumber += Math.floor(pseudoRandom() * 10);
  }

  // reverse number and convert to int

  var reversedCCnumberString = strrev(ccnumber);

  var reversedCCnumber = new Array();
  for (var i = 0; i < reversedCCnumberString.length; i++) {
    reversedCCnumber[i] = parseInt(reversedCCnumberString.charAt(i));
  }

  // calculate sum

  var sum = 0;
  var pos = 0;

  while (pos < length - 1) {

    var odd = reversedCCnumber[pos] * 2;
    if (odd > 9) {
      odd -= 9;
    }

    sum += odd;

    if (pos != (length - 2)) {

      sum += reversedCCnumber[pos + 1];
    }
    pos += 2;
  }

  // calculate check digit

  var checkdigit = ((Math.floor(sum / 10) + 1) * 10 - sum) % 10;
  ccnumber += checkdigit;

  return ccnumber;

}

/**
 * Actually generate a credit card number
 * @param  {[type]} prefixList [description]
 * @param  {[type]} length     [description]
 * @param  {[type]} howMany    [description]
 * @return {[type]}            [description]
 */
function credit_card_number(prefixList, length, howMany) {

  var result = new Array();
  for (var i = 0; i < howMany; i++) {

    var randomArrayIndex = Math.floor(pseudoRandom() * prefixList.length);
    var ccnumber = prefixList[randomArrayIndex];
    result.push(completed_number(ccnumber, length));
  }

  return result;
}

/**
 * Supported Card Schemes
 * @type {Array}
 */
module.exports.Schemes = {
  "VISA": {
    prefixList: visaPrefixList,
    digitCount: 16
  },
  "MasterCard": {
    prefixList: mastercardPrefixList,
    digitCount: 16
  },
  "Amex": {
    prefixList: amexPrefixList,
    digitCount: 15
  },
  "Diners": {
    prefixList: dinersPrefixList,
    digitCount: 16
  },
  "Discover": {
    prefixList: discoverPrefixList,
    digitCount: 16
  },
  "EnRoute": {
    prefixList: enRoutePrefixList,
    digitCount: 16
  },
  "JCB": {
    prefixList: jcbPrefixList,
    digitCount: 16
  },
  "Voyager": {
    prefixList: voyagerPrefixList,
    digitCount: 16
  }
}

/**
 * The entry-point function
 * @param {String} CardScheme  The Card Scheme
 * @param {Number} [howMany]   Defaults to 1
 * @param {Number} [randomGen] Pseudo Random Generator. Must generate a random number between 0 an 1
 * @return {String}
 */
module.exports.randomCreditCard = function (CardScheme, howMany, randomGen) {
  pseudoRandom = randomGen || pseudoRandom;
  var amount = howMany || 1;
  // Try to get configs to the selected Scheme
  if (typeof module.exports.Schemes[CardScheme] != 'undefined') {
    return credit_card_number(
      module.exports.Schemes[CardScheme].prefixList,
      module.exports.Schemes[CardScheme].digitCount,
      amount
    );
  }
  else { // Defaults to MasterCard
    return credit_card_number(
      module.exports.Schemes["MasterCard"].prefixList,
      module.exports.Schemes["MasterCard"].digitCount,
      amount
    );
  }
}