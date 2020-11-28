module.exports = (bot) => {
  console.log("💻 Loading commands...")
  bot.fs.readdirSync("./commands/").forEach(dir => {
    if (!dir.includes(".js")) {
      const commands = bot.fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));
      for (let file of commands) {
        let pull = require(`../commands/${dir}/${file}`);
        if (!pull) continue;
        if (pull.name) {
          bot.commands.set(pull.name, pull);
        } else continue;
        if (pull.aliases) {
          pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
        }
      }
    }
  });
  console.log("💻 Commands loaded successfully!")
}