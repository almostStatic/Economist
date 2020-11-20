const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "ban",
	"aliases": ["ban"],
	"description": "Bans a user from the current guild.",
	"category": "mod",
	async run(client, message, args) {
		if (!message.member.roles.cache.has(client.config.roles.mod.normal)) return message.channel.send("You must have the Moderator role in order to use this command. Trial Mods do not have permission to use this command, either.");

		if (args.length < 1) return message.channel.send("You must provide a `user` resolvable for your ban.")
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send(`${client.config.emoji.err} You have provided an invalid user!`);
		var reason = args.slice(1).join(' ');
		if (!reason) reason = "<no reason was provided>"
		const infcs = await client.db.get(`infcs${user.id}`) || 0;
		await client.db.set(`infcs${user.id}`, Number(infcs) + 2);
		const log = new MessageEmbed()
		.setColor(client.config.colors.red)
		.setTitle(`Member Banned`)
		.setThumbnail(message.author.displayAvatarURL())
		.addField("Moderator", `${message.author.tag} (${message.author.id})`, true)
		.addField("Target", `${user.tag} (${user.id})`, true)
		.addField("Reason", reason)
		.addField("Infractions", infcs + 2)
		.setTimestamp();
		const logMsg = await client.channels.cache.get(client.config.channels.modlog).send({ embed: log })
		const Notification = new MessageEmbed()
		.setColor(client.config.colors['red'])
		.setDescription(`You have received a permanent ban from ${message.guild.name}. Note that your ban might be lifted soon—to appeal for a ban (or check your remaining ban length), please PM ${client.users.cache.get(client.config.owner).tag}. Additionally, if you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}—[Log Message](${logMsg.url})`)
		.addField("Moderator", message.author.tag, true)
		.addField("Infractions", infcs + 2, true)
		.addField("Reason", reason, true)

		const msgs = [`${client.config.emoji.tick} ${user.tag} has been permanently banned from the server and has been sent the following message:`];

		var GuildMember = message.guild.members.cache.get(user.id);
		
		if (!GuildMember) {
			await message.guild.members.ban(user.id, { reason: `Banned by ${message.author.tag} (${message.author.id}); reason=${reason}` })
			message.channel.send(msgs[0]);
			message.channel.send({ embed: Notification });
		} else {
		if (GuildMember.hasPermission('BAN_MEMBERS')) return message.channel.send(`You're not allowed to ban a moderator!`)
		GuildMember
			.send({ embed: Notification })
				.catch((x) => {});
		GuildMember.ban(`Banned by ${message.author.tag} (${message.author.id}); reason=${reason}`);
		}
	}
}
