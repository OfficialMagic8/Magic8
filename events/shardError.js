module.exports = {
  name: "shardError",
  run: async (bot, error, shardID) => {
    console.error(`SHARD ERROR ON #${shardID}:\n${error}`)
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