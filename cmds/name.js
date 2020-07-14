const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'name',
	aliases: ['name'],
	description: 'Name your pet.',
	supreme: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must specify a new name for your pet!")
		let newName = args.join(' ');
		if(newName.length > 50) return message.channel.send("Your pet's name may not exceed 50 characters in length.")
	await client.db.set('pet_name' + message.author.id, newName);
	message.channel.send({
		embed: new MessageEmbed()
		.setColor(message.author.color)
		.setDescription(`${message.author.tag} has successfully renamed their pet to ${newName}`)
	})
	},
}