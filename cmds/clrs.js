const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "clrs",
	category: 'utl',
	aliases: [ "viewclrs", "clrs", "colors", "colours" ],
	description: "View someone's colour preferences",
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.usr(args[0])
			.catch((x) => {});
		if (!usr) usr = message.author;
		const clrs = await client.db.get("color" + usr.id) || client.config.defaultHexColor;
		return message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(
				`${usr.tag}'s Colour Preferences`
			)
			.setDescription(
				`Every time you use a command, a random colour from here is chosen and displayed \n\n\`\`\`js\n${client.inspect(clrs.split(";"))}\`\`\``
			)
		});		
	}
}