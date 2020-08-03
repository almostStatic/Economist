const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'infractions',
	aliases: ['infractions', 'infcs', 'infr'],
	description: "View a mentioned user's infractions",
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.usr(args[0]).catch((x)=>{})
		if (!usr) usr = message.author;

		const infc = await client.db.get("infcs" + usr.id) || 0;
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor(`${usr.tag}'s Server Infractions`)
			.setDescription("```js\n" + infc + "\n```")
		})
	},
}