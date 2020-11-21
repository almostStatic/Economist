const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'delete',
	aliases: ['delete', 'del'],
	description: 'Deletes something from the database',
	usage: '<name of thing to delete(string)>',
	dev: false,
	db: true,
	category: 'btsf',	
	guild: false,
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send("You must specify a user and a key to delete");
		const user = await client.usr(args[0])
		let key = args.slice(1).join(' ');
		if (!key) return message.channel.send("You must provide something to delete under the format of `" + message.guild.prefix + "delete <key>" + '`');
		const t = await client.db.get(key + user.id);
		if (!t) return message.channel.send("`" + key + user.id + "` does not exist.");
		try {
			await client.db.delete(key + user.id);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully removed ${key}${user.id}`)
			})
		} catch (err) {
			console.error(err);
			message.channel.send(":x: Error => `" + err.message + "` sent to console.")
		}
	},
}