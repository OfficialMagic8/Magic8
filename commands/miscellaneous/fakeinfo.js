const Discord = require("discord.js");
const faker = require('faker');
module.exports = {
  aliases: ["fi"],
  category: "MISCELLANEOUS",
  description: "Create a random and fake profile",
  emoji: "📦",
  name: "fakeinfo",
  toggleable: true,
  run: async (bot, message, args, prefix, guildData) => {
    let language = bot.utils.getLanguage(bot, guildData.language);
    let firstName = faker.name.firstName();
    let firstLastName = faker.name.lastName();
    let fakedinfoobject = {
      names: Math.floor(Math.random() * 100) > 50 ? firstName : `${firstName} ${faker.name.firstName()}`,
      firstlastname: firstLastName,
      secondlastname: faker.name.lastName(),
      company: faker.company.companyName(),
      email: faker.internet.email(),
      username: faker.internet.userName([firstName, firstLastName]).replace(/\,/g, "."),
      password: faker.internet.password(),
      photo: faker.image.avatar(),
      phone: faker.phone.phoneNumber("(###) ###-####"),
      address: faker.address.streetAddress("###"),
      city: faker.address.city(),
      zip: faker.address.zipCode(),
      latitute: faker.address.latitude(),
      longitude: faker.address.longitude(),
      birthday: faker.date.between('1955-01-01', '2001-12-30').toLocaleString().split(",")[0].trim()
    }
    let embed = new Discord.MessageEmbed()
      .setColor(bot.colors.blue)
      .setDescription(bot.translate(bot, language, "fakeinfo.description").join("\n")
        .replace(/{CHECK}/g, bot.emoji.check)
        .replace(/{USER}/g, message.author)
        .replace(/{FAKEINFO}/g, JSON.stringify(fakedinfoobject, null, 2))
        .replace(/{INFO}/g, bot.emoji.info));
    return message.channel.send(embed).catch(e => { return bot.error(bot, message, language, e); });
  }
}