const { MessageEmbed } = require("discord.js");
module.exports = {
  aliases: ["ev"],
  description: "",
  name: "eval",
  dev: true,
  run: async (bot, message, args, prefix, guildData) => {
    if (message.author.id !== bot.developer.id) return;
    const clean = text => {
      if (typeof (text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      } else return text;
    }
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      message.channel.send(clean(evaled), { code: "xl" });
    } catch (e) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
}  