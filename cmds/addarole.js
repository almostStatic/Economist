const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addarole',
	aliases: ['addarole'],
	description: 'Give a user an assignable role; you must supply its ID since it will add a set role to them as-is... kinda hard to explain',
	async run(client, message, args) {
		if (message.author.id != client.config.owner) {
			return message.channel.send("You do not have permission to do that.")
		}
		if (args.length < 3) return message.channel.send("Format: `~addarole <user> <id> <kw>`")
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) {
			return message.channel.send("User not found")
		}
		let id = message.guild.roles.cache.find(x => x.id == args[1]);
		if (!id) return message.channel.send('role not found');
		let kw = args[2].toLowerCase();
		let roles = await client.db.get('role' + user.id) || {};
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");
		const RoleObject = {
			name: id.name, 
			id: id.id, 
			color: id.hexColor
		}
		let setAs = Object.assign({}, roles, { [kw]: RoleObject })
		console.log(setAs)
		await client.db.set('role' + user.id, setAs)
//		await client.db.get('role' + message.author.id).then(console.log)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully bound ${id.name} to ${user.tag}`)
		})
	}
}