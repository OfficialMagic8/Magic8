module.exports = {
  name: "rateLimit",
  run: async (bot, rateLimitInfo) => {
    if (bot.debug) {
      console.log("Rate Limit:");
      console.log(rateLimitInfo);
    }
  }
}