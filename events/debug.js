module.exports = {
  name: "debug",
  run: async (bot, info) => {
    if (bot.debug === true) {
      console.log(info);
    } else return;
  }
}