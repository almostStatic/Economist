const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'editrolekw',
	aliases: ['editrolekw', 'edrk', 'erk'],
	description: 'Edit a role\'s keyword. usage `editrolekw <old keyword> <new keyword>`',
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must provide a valid role keyword.")
		let roles = await client.db.get('role' + message.author.id);
		if (!roles) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}roles\``);
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");

		let key = args[0].toLowerCase();
		let newkw = args[1].toLowerCase();
		let data = roles;
		if (!Object.keys(roles).includes(key)) {
			return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: `" + Object.keys(roles).map(x => x).join(', ') || 'NoneType' + "`");
		};
		let role = Object.freeze(roles[key]);
		delete data[key];
		let _data = Object.assign({}, data, { [newkw]: role })
		await client.db.set('role' + message.author.id, _data)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully edited ${key} keyword to ${newkw}`)
		});
	}
}