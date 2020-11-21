let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unblacklist",
	aliases: ['unbl', "unbotban"],
	botDeveloper: true,
	desc: "unblacklist a user from the bot.",
	usage: "unblacklist [user] [reason]",
	category: 'own',
async run(client, message, args) {
	if (args.length < 1) return message.channel.send("You must input a UserResolvable argument.")
  const user = await client.usr(args[0]).catch((x) => {});
  const banned = await client.db.get("blacklist" + user.id);
  if (!user) return message.reply("Please provide a valid ID or mention a user in the server!");
	const mem = client.guilds.cache.get(client.config.supportServer)
		.members.cache.get(user.id);

	const msg = `${client.config.emoji.tick} ${user.tag} was`;
	const Embeds = {
		unblacklisted: new MessageEmbed()
		.setColor(client.config.colors.green)
		.setDescription(`You have been unblacklisted from Economist. This means that you're now allowed to use the bot and will no longer be ignored!`)
		.addField(
			"Developer",
			message.author.tag
		)
		.addField("Reason", args.slice(1).join(" ") || "no reason")		
	}
	if (banned) {
		if (mem) { 
    	await mem.roles.remove(client.config.roles.blacklistedRole, "User Was removed from being banned by a developer or owner.").catch((x) => {});
		};
		await client.db.delete("blacklist" + user["id"]);
		message.channel.send(`${msg} successfully unblacklisted and was sent the following message:`);
		message.channel.send({ embed: Embeds.unblacklisted });
		return user 
			.send({ embed: Embeds.unblacklisted })
				.catch((x) => {});
	} else {
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(client.config.colors.green)
				.setDescription(`${client.config.emoji.tivk} That user is not blacklisted!`)
			})		
		};
	},
};