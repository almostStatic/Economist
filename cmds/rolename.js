const Discord = require('discord.js');

module.exports = {
	name: 'rolename',
	aliases: ["rolename", 'rolename','rn'],
	category: 'ecn',
	description: "Change the name of your assignable role!",
	async run(client, message, args) {
		if (message.guild.id != client.config.supportServer) return message.channel.send("This command only works in the support server as a result of how role information is manipulated.");		
		if (args.length < 2) {
			return message.channel.send("You must specify a valid role keyword and a new role name under the format of `" + message.guild.prefix + "rolename <keyword> <new name>`");		
		};

		let roles = await client.db.get('role' + message.author.id);
		if (!roles) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");

		let key = args[0].toLowerCase();
		if (!Object.keys(roles).includes(key)) {
			return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: `" + Object.keys(roles).map(x => x).join(', ') + "`");
		};

		let name = args.slice(1).join(' ').slice(0, 500);
		if (!name) return message.channel.send("You must specify a new role name in order for this command to work! (max rolename length is 500 chars)")

		let role = roles[key];

		let Role = message.guild.roles.cache.get(role.id);
		if (!Role) return message.channel.send(`${client.config.emoji.err} I cannot find your custom role!`);
		const data = Object.assign({}, roles, { [args[0]]: {
			name: name,
			id: Role.id, 
			color: Role.hexColor 
		} })
		await client.db.set('role' + message.author.id, data);		
		Role.setName(name, `Custom role name changed by ${message.author.tag}`)
		return await message.channel.send("", {
			embed: new Discord.MessageEmbed()
			.setDescription(`${client.config.emoji.tick} Edited the ${role.name} role to ${name}`)
			.setColor(message.author.color)
		});
	},
};