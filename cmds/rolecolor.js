const Discord = require('discord.js');

module.exports = {
	name: 'rolecolor',
	aliases: ["rolecolor", 'rolecolour','rc'],
	description: "Change the color of your assignable role! (for black, use `#000001`)",
	category: 'ecn',
	usage: 'rolecolor <@role, ID or name> <new hex color>',
	async run(client, message, args) {
		if (message.guild.id != client.config.supportServer) return message.channel.send("This command only works in the support server as a result of how role information is manipulated.");		
		if (args.length < 2) {
			return message.channel.send("You must specify a valid role keyword and a new hex colour code under the format of `" + message.guild.prefix + "rolecolor <keyword> <hex colour>`")
		}
		let col = args[1];
		if (!col) return message.channel.send(`${client.config.emoji.err} You need to provide a valid hex color code. Make sure you use the correct format: \`${message.guild.prefix}rolecolor [role keyword] [hex color]\``)

		let roles = await client.db.get('role' + message.author.id);
		if (!roles) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");

		let key = args[0].toLowerCase();
		if (!Object.keys(roles).includes(key)) {
			return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: `" + Object.keys(roles).map(x => x).join(', ') + "`");
		};

		let role = roles[key];

		args[1] = args[1].replace(/#+/g, '');
		let color = args[1];
		let len = args[1].length - 6;
		let x = args[1].slice(0, -len);
		if (!color.startsWith('#')) {
			color = `#${args[1]}`;
		} else {
			color = args[1];
		};
		if (args[1].length > 6 && !args[1].startsWith("#")) {
			color = `#${x}`
		} else if (args[1].length > 6) {
			color = x;
		}
		role = message.guild.roles.cache.get(roles[key].id);

		let regex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
		result = regex.test(color);
		if(result == true) {
			role.setColor(color);
			await client.db.set('role' + message.author.id, Object.assign({}, roles, { [args[0]]: {
				name: role.name,
				id: role.id, 
				color: role.hexColor, 
			} }));
			return message.channel.send("", {
				embed: new Discord.MessageEmbed()
				.setDescription(`${client.config.emoji.tick} Colour for role ${role.name} was successfully changed from ${roles[key].color} to **${color}**`)
				.setColor(color)
			});
		} else {
			return message.channel.send(`${client.config.emoji.err} You need to provide a valic HEX color code`, {
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`**Examples:** \`#ff0000\` or \`#ffff00\`\nFor help, use a [Hex color picker](https://htmlcolorcodes.com/)!`)
			});
		};
	},
};