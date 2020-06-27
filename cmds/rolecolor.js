const Discord = require('discord.js');

module.exports = {
	name: 'rolecolor',
	aliases: ["rolecolor", 'rolecolour','rc'],
	desc: "Change the color of your assignable role! (for black, use `#000001`)",
	usage: 'rolecolor <@role, ID or name> <new hex color>',
	async run(client, message, args) {
		let col = args[0];
		if (!col) return message.channel.send(`${client.config.emoji.err} You need to provide a valid hex color code. Make sure you use the correct format: \`${message.guild.prefix}rolecolor [hex color]\``)
		let hex;
		if (!col.startsWith("#")) {
			hex = "#" + col;
		} else {
			hex = col;
		};
		let id = await client.db.get('role' + message.author.id);
		if (!id) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		let role = message.guild.roles.cache.get(id);
		if (!role) return message.channel.send(`${client.config.emoji.err} I cannot find your custom role!`)
		let regex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
		result = regex.test(hex);
		if(result == true) {
			role.setColor(hex);
		return message.channel.send("", {
			embed: new Discord.MessageEmbed()
			.setDescription(`${client.config.emoji.tick} Color for role ${role} was successfully changed to **${col}**`)
			.setColor(col)
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