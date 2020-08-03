const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'com',
	aliases: ["com", "comma"],
	description: "Toggle comme separation on/off",
	async run(client, message, args) {
		if (message.author.com == 1) {
			await client.db.delete("noComma" + message.author.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${escapeMarkdown(message.author.tag)} has toggled comma separation on`)
			})
		} else {
			await client.db.set("noComma" + message.author.id, 1);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${escapeMarkdown(message.author.tag)} has toggled comma separation off`)
			})
		}
	}
}