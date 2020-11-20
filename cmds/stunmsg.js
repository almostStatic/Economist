const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "stunmsg",
	aliases: ['stunmsg', 'stun-msg'],
	description: 'Update a user\'s stun message',
	dev: true,
	category: 'btsf',
	async run (client, message, args) {
		if (!args.length) return message.channel.send("You must mention a user and include a new stun message!")
		let usr = await client.usr(args[0])
		if (!usr) return message.channel.send("what are you THINKING bro that's not even a valid user")
		let m = args.slice(1).join(" ")
		await client.db.set('stunmsg' + usr.id, client.trim(m, 1_500))
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} Updated ${usr.tag}'s stun message to "${client.trim(m, 1_500)}"`)
		})
	}
}