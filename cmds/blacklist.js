let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "blacklist",
	aliases: ['bl', "botban"],
	botDeveloper: true,
	desc: "un/blacklist a user from the bot.",
	usage: "blacklist [user] <+/->",
	category: 'own',
async run(client, message, args) {
	if (args.length < 1) return message.channel.send("You must input a UserResolvable argument.")
  const user = await client.usr(args[0]).catch((x) => {});
  const banned = await client.db.get("blacklist" + user.id);
  if (!user) return message.reply("Please provide a valid ID or mention a user in the server!");
	var allow = false;
  const developer = client.guilds.cache.get(client.config.supportServer).members.cache.get(user.id);
	if (!developer) allow = true;
	if (developer && (developer.roles.cache.has(client.config.roles.botDeveloper))) allow = false;
	if (allow == false) return message.channel.send("This command may not be executed on developers.");

	const msg = `${client.config.emoji.tick} ${user.tag} was`;
	const Embeds = {
		unblacklisted: new MessageEmbed()
		.setColor(client.config.colors.green)
		.setDescription(`You have been unblacklisted from Economist. This means that you're now allowed to use the bot and will no longer be ignored!`)
		.addField(
			"Developer",
			message.author.tag
		)
		.addField("Reason", args.slice(1).join(" ") || "no reason"),
		blacklisted: new MessageEmbed()
		.setColor(client.config.colors.red)
		.setDescription(`You have been blacklisted from Economist. This means that you will not be allowed to use the bot and will be ignored. If you believe you were wrongly punished, please PM ${client.users.cache.get(client.config.owner).tag}`)
		.addField(
			"Developer",
			message.author.tag
		)
		.addField("Reason", args.slice(1).join(" ") || "no reason")		
	}
	if (banned) {
		return message.channel.send({
			embed: new MessageEmbed()
			.setColor(client.config.colors.red)
			.setDescription(`${client.config.emoji.err} That user is already blacklisted`)
		})
	} else {
if (developer === true) return message.reply("You may not blacklist or unblacklist Developers!");
    const mem = client.guilds.cache.get(client.config.supportServer).members.cache.get(user.id)
      if (mem !== undefined){
      await mem.roles.add(client.config.roles.blacklistedRole, "User Was bot banned by a developer or owner.").catch((x) => {});
      }
		await client.db.set("blacklist" + user["id"], 1);
		message.channel.send(`${msg} successfully blacklisted and was sent the following message:`);
		message.channel.send({ embed: Embeds.blacklisted });
		user 
			.send({ embed: Embeds.blacklisted })
				.catch((x) => {});
	}
	}
};