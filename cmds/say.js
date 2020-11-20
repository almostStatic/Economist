const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'say',
	aliases: ['say', 'echo'],
	description: 'Gets the bot to say your message',
	category: 'fun',
	async run(c, message, a) {
		if (!a.length) return message.channel.send("You must specify a message for me to say!");
		var msg = a.join(' ');
		message.channel.send(msg);
	},
};