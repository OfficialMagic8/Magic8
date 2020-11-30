module.exports = (bot) => {
  bot.fs.readdir("./events/", (err, files) => {
    if (err) console.log(err);
    console.log("📢 Loading events...")
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    jsfile.forEach((f) => {
      let props = require(`../events/${f}`);
      bot.events.set(props.name, props);
    });
    console.log("📢 Events loaded successfully!")
  });
}