const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'color',
	category: 'utl',	
	aliases: ['color', 'colour', 'setcolor', 'setcolour', 'set-color', 'set-colour'],
	description: "Changes your colour prefrence (custom color on embeds) you must have the colorist role in the main server",
	usage: "<hexCode>",
	dev: false,
	guild: false,
	col: true,
	async run(client, message, args) {
		if (!args.length) {
			const clrs = await client.db.get("color" + message.author.id) || `${client.config.defaultHexColor}`
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(
					`${message.author.tag}'s Colour Preferences`
				)
				.setDescription(
					`Every time you use a command, a random colour from here is chosen and displayed \n\n\`\`\`js\n${client.inspect(clrs.split(";"))}\`\`\``
				)
			});
		};

		const colors = args
			.map((arg) => {
				const color = `#${arg.replace(/#+/g, '').slice(0, 6)}`;
				if (/^#([a-f\d]{6}|[a-f\d]{3})$/i.test(color)) {
					return color;
				}
				return false;
			});		
			
		if (colors.includes(false)) {
			return message.channel.send("One of your provided hex colour codes is not valid; please check all values and try again; separated by spaces. If this problem persists, feel free to contact `" + client.users.cache.get(client.config.owner).tag + "`");
		}

		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has set their colour preferences to \`${client.inspect(colors)}\`. Use \`${message.guild.prefix}color\` to view a list of all your currently set colours.`)
		})
		await client.db.set("color" + message.author.id, colors.join(";"))
	},
}