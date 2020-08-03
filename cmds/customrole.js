const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'customrole',
	aliases: ['myrole', 'customrole', 'custom-role'],
	description: 'displays info about your assignable role',
	async run(client, message, args) {
		await message.guild.members.fetch();
		let user = await client.usr(args[0] || message.author.id);
		if (!user) user = message.author;
		let id = await client.db.get('role' + user.id);
		if (!id) return message.channel.send(`You do not own a custom role.`);
		let role = message.guild.roles.cache.get(id);
		if (!role) return message.channel.send(`You do not own a custom role.`);

		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setFooter(`ID: ${role.id}`)
			.setTitle(`${user.tag}'s Custom Role`)
			.setDescription(role)
		  .addField(`Name`, role.name, true)
			.addField('Hoisted', role.hoisted == true ? client.config.emoji.tick : client.config.emoji.err, true)
			.addField('Position', role.position, true)
			.addField('Colour', role.hexColor || 'no colour')
			.addField(`Members [${role.members.size}]`, role.members.map(x => x.user.tag).join(', ') || `No members found with this role`),
		})
	},
}