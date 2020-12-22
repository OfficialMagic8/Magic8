require("dotenv").config()
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env.DISCORD_TOKEN });

const Statcord = require("statcord.js");
const statcordsettings = {
  manager,
  key: process.env.STATCORD_TOKEN,
  autopost: true,
}
const statcord = new Statcord.ShardingClient(statcordsettings);
statcord.on("autopost-start", () => {
  console.log("Auto-Posting Statcord");
});
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();