const Discord = require("discord.js");
const fs = require("fs")
module.exports = {
  name: "error",
  run: async (bot, error) => {
    console.error(`ERROR:\n${error}`)
    let date = new Date().toLocaleString().split(" ")
    let args = `${date[1]} ${date[2]}`
    let name = args.replace(/:/g, "_").replace(" ", "_")
    try {
      bot.fs.writeFileSync(`../errors/${name}.txt`, error)
    } catch (e) {
      console.error(`Could Not Catch Error\n${e}`)
    }
  }
}