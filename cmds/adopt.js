const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'adopt',
	aliases: ['adopt', 'getpet'],
	description: 'Adopt a pet! (`~pet`)',
	async run(client, message, args) {
		const DATA = await client.db.get('pet' + message.author.id);
		if(DATA) return message.channel.send("You already seem to own a pet!")
		await client.db.set('pet' + message.author.id, true);
		await client.db.set('pet_health' + message.author.id, 10000);
		await client.db.set('pet_affec' + message.author.id, 0);
		await client.db.set('pet_energy' + message.author.id, 100);
		await client.db.set('pet_level' + message.author.id, 1);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has adopted a pet! \`${message.guild.prefix}pet\``)
		})
	}
}