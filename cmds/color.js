const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'color',
	aliases: ['color', 'colour', 'setcolor', 'setcolour', 'set-color', 'set-colour'],
	description: "Changes your colour prefrence (custom color on embeds) you must have the colorist role in the main server",
	usage: "<hexCode>",
	dev: false,
	guild: false,
	col: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s colour preference is **${message.author.color.startsWith('#') ? message.author.color : `#${message.author.color}`}**`)
		});
		args[0] = args[0].replace(/#+/g, '');
		let color = args[0];
		let len = args[0].length - 6;
		let x = args[0].slice(0, -len);
		console.log(x)
		if (!color.startsWith('#')) {
			color = `#${args[0]}`;
		} else {
			color = args[0];
		};
		if (args[0].length > 6 && !args[0].startsWith("#")) {
			color = `#${x}`
		} else if (args[0].length > 6) {
			color = x;
		}
		let regex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
		var result = regex.test(color);
		let setv = 'y';
		if(result == true) {
			 message.channel.send({
				embed: new MessageEmbed()
				.setColor(color)
				.setDescription(`${message.author.tag} has successfully updated their colour preference to **${color}**`),
			}).catch((x) => {
				setv = "n";
				return message.channel.send(`You didn't provide a valid HEX color code`)
			})
			if (setv != 'n') {
				await client.db.set('color' + message.author.id, color);
			};
		} else {
			message.channel.send(`Whoops! That doesn't seem to be a valid HEX colour code. If you're having issues, feel free to DM \`${client.users.cache.get(client.config.owner).tag}\``)
		}
	},
}