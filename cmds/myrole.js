const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'myrole',
	aliases: ['myrole'],
	description: 'displays info about your assignable role',
	async run(client, message, args) {
		await message.guild.members.fetch();
		let id = await client.db.get('role' + message.author.id);
		if (!id) return message.channel.send(`You do not own a custom role.`);
		let role = message.guild.roles.cache.get(id);
		if (!role) return message.channel.send(`You do not own a custom role.`);

		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setFooter(`ID: ${role.id}`)
			.setTitle(`${message.author.tag}'s Custom Role`)
			.setDescription(role)
		  .addField(`Name`, role.name, true)
			.addField('Hoisted', role.hoisted ? client.config.emoji.tick : client.config.emoji.err, true)
			.addField('Position', role.position, true)
			.addField('Color', role.hexColor || 'no colour')
			.addField(`Members [${role.members.size}]`, role.members.map(x => x.user.tag).join(', ') || `No members found with this role`),
		})
	},
}