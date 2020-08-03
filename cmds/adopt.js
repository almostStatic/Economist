const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'adopt',
	aliases: ['adopt', 'getpet'],
	description: 'Adopt a pet! (`~pet`)',
	async run(client, message, args) {
		const DATA = await client.db.get('pet' + message.author.id, { raw: true });
		if(DATA) return message.channel.send("You already seem to own a pet!")
		await client.db.set('pet' + message.author.id, "1;10000;100;0;1;1;1;1;0");
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has adopted a pet! \`${message.guild.prefix}pet\``)
		})
	}
}