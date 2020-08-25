const keys = require('keyv');
const Discord = require('discord.js');

module.exports = {
	name: 'get',
	aliases: ['get', 'getv'],
	description: 'gets a value from the database and returns it. (also shows its data type and how it is formatted by the interpreter)',
	usage: '<user> <key>',
	dev: true,
	db: true,
	guild: false,
	async run(client, message, args) {
		if (args.length > 2) return message.channel.send("You must specify a user and a key")
		let user = await client.usr(args[0]);
		if (!user) return message.channel.send("You must specify a user for this command to work!")
		let key = args.slice(1).join(' ');
		if(!key) return message.channel.send("You must provide a `<key>`, refer to <#726059916791644291> for further details")
		let x = await client.db.get(key + user.id)
		if (!x) return message.channel.send(`That value does not exist.`)
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`\`\`\`js\n${require("util").inspect(x, { depth: 1000000000 })}\n\`\`\``)
		})
	},
}