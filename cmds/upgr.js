const { run } = require("./leaderboard");

module.exports = {
  name: "upgr",
  aliases: ["upgr"],
  description: "view upgr key stored for you (used by bot admins",
  async run(client, message, args) {
    let user = await client.usr(args[0]).catch((x) => {});
    if (!user) user = message.author;
    const upgr = await client.db.get("upgr" + user.id) || `${client.config.roles.memberRole}`;
    message.channel.send(`upgr${user.id}=${upgr}`, { split: true, code: "" })
  }
}