const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'delete',
	aliases: ['delete', 'del'],
	description: 'Deletes something from the database',
	usage: '<name of thing to delete(string)>',
	dev: false,
	db: true,
	guild: false,
	async run(client, message, args) {
		const key = args.join(' ');
		if (!key) return message.channel.send("You must provide something to delete under the format of `" + message.guild.prefix + "delete <key>" + '`');
		const t = await client.db.get(key);
		if (!t) return message.channel.send("`" + key + "` does not exist.");
		try {
			await client.db.delete(key);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription("Successfully **deleted** " + key)
			})
		} catch (err) {
			console.error(err);
			message.channel.send(":x: Error => `" + err.message + "` sent to console.")
		}
	},
}