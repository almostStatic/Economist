const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'reset',
	aliases: ['reset'],
	description: "Resets the entire bot (not a jk)",
	usage: "<>",
	dev: false,
	guild: false,
	async run(client, message, args) {
		if (message.author.id != client.config.owner) {
			return message.channel.send("You don't have permission to use this command!")
		};
		await client.db.clear();
			message.channel.send({
				embed: new MessageEmbed()
				.setDescription("Successfully wiped the entire database")
				.setColor('#da0000')
			});
	},
};