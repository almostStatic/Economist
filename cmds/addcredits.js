const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addcredits",
  aliases: [ "addcredits", "addcred" ],
  description: "Adds pet credits to a certain user",
  category: "own",
  db: true,
  async run(client, message, args) {
    const msg = await message.channel.send("Please wait...")
    if (args.length < 2) return msg.edit("Desired usage for this command is: `" + message.guild.prefix + "addcredits <user> [amount]`");
    const user = await client.usr(args[0])
      .catch((er) => {});
    if (!user) return msg.edit("DiscordAPIError: Unknown User");
    const credits = isNaN(args[1]) ? 1 : Number(args[1]);
    var data = await client.db.get("pet" + user.id);
    if (!data) return msg.edit(`${user.tag} doesn't have a pet.`);
    data = data.split(";");
    if (data.length < 9) return msg.edit("Malformed pet");
    data[4] = Number(data[4]) + (credits);
    await client.db.set("pet" + user.id, data.join(";"))
    msg.edit("", {
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has received :star: ${credits}`)
    })
  }
}