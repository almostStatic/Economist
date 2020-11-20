const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'role',
	aliases: ['role'],
	category: 'ecn',
	description: "adds/removes a role from someone only if you own an assignable role :D",
	async run(client, message, args) {
		if (message.guild.id != client.config.supportServer) return message.channel.send("This command only works in the support server as a result of how role information is manipulated.");
		if (args.length < 2) return message.channel.send("You must provide a valid role keyword followed by the target user!")
		let roles = await client.db.get('role' + message.author.id);
		if (!roles) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");

		let key = args[0].toLowerCase();
		if (!Object.keys(roles).includes(key)) {
			return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: `" + Object.keys(roles).map(x => x).join(', ') + "`");
		};

		let role = roles[key];

		let usr = await client.usr(args[1]).catch((x) => {})
		if (!usr) return message.channel.send("You didn't specify a user??!!")

		let guildMember = message.guild.members.cache.get(usr.id);
		if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${usr.tag} is not a member of this server`);
		if(guildMember.roles.cache.has(role.id)) {
			await guildMember.roles.remove(role.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has lost the ${role.name} role`)
			})
		};
	
		if(!guildMember.roles.cache.has(role.id)) {
			await guildMember.roles.add(role.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has received the ${role.name} role`)
			})
		};
	},
}