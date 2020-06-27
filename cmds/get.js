const Discord = require('discord.js');
const keyv = require('keyv');

module.exports = {
	name: 'get',
	aliases: ['get', 'g'],
	usage: 'get `<key>`',
	description: 'get something from the database',
	dev: true,
	guild: false,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You need to provide something for me to get from my database in order for this command to work!")
		const k = args.join(' ');
		const v = await client.db.get(k);
		if (!v) return message.channel.send("That doesn't exist in my database!")
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription('```js\n'+require("util").inspect(v, { depth: 0}) + '\n```')
		});
	},
};