const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'role',
	aliases: ['role'],
	description: "adds/removes a role from someone only if you own an assignable role :D",
	async run(client, message, args) {
		if(message.guild.id != client.config.supportServer) return message.channel.send("This command only works in the support server!");
		if (!args.length) return message.channel.send("You need to provide a user to whom you wish to role")
		let role = await client.db.get('role' + message.author.id);
		if (!role) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		let gr = message.guild.roles.cache.get(role);
		if (!gr) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);

		let usr;
			try {
				usr = await client.users.fetch(client.getID(args[0]))
			} catch (err) {
				usr = await client.users.fetch(args[0]).catch((x) => { return message.channel.send('An invalid user was provided.')});
			};
		if (!usr) return;

		let guildMember = message.guild.members.cache.get(usr.id);
		if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${usr.tag} is not a member of this server`);
		if(guildMember.roles.cache.has(gr.id)) {
			await guildMember.roles.remove(gr.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} no longer has the ${gr.name} role`)
			})
		};
	
		if(!guildMember.roles.cache.has(gr.id)) {
			await guildMember.roles.add(gr.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} now has the ${gr.name} role`)
			})
		};
	},
}