const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unmute',
	aliases: ['unmute', 'un-mute'],
	description: 'unmutes a user.',
	async run (client, message, args) {
		if (!message.member.roles.cache.some(r=>[client.config.roles.mod.trial, client.config.roles.mod.normal].includes(r.id))) {
			return message.channel.send(`${client.config.emoji.err} You need to be a moderator in order to use this command`)
		};
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => {});
		};		
		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);
		let member = message.guild.member(usr.id);
		if (!member) return message.channel.send(`${client.config.emoji.err} The specified user is not a member of this server`);
		if (!member.roles.cache.has(client.config.roles.muted)) {
			return message.channel.send(`${client.config.emoji.err} ${member.user.tag} isn't muted... how are you gonna unmute them?`);
		};
		let dm = new MessageEmbed()
		.setColor(client.config.colors.green)
		.setDescription(`Your mute has been removed in ${message.guild.name}`)
		.addField(`Moderator`, message.author.tag, true)
		.addField("Reason", args.slice(1).join(' ') || "No reason given", true)
		let log = await client.channels.cache.get(client.config.channels.modlog).send({
			embed: new MessageEmbed()
			.setTitle(`Member Unmuted`)
			.setColor(client.config.colors.green)
			.addFields(
				{ name: 'Moderator', value: `${message.author.tag} | ${message.author.id}`, inline: true },
				{
					name: 'Member',
					value: `${member.user.tag} | ${member.id}`,
					inline: true,
				},
				{
					name: "Reason",
					value: args.slice(1).join(' ') || "No reason given"
				}
			)
			.setFooter("Unmuted At")
			.setTimestamp()
		})
		member.roles.remove(client.config.roles.muted);
		await client.db.delete('mute' + usr.id);
		await message.channel.send(`${client.config.emoji.tick} ${member.user.tag} has been unmuted and was sent the following message:`)
		message.channel.send(dm);
		member.send(dm);
	}
}