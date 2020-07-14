const keys = require('keyv');
const Discord = require('discord.js');

module.exports = {
	name: 'set',
	aliases: ['set', 's'],
	description: 'sets a value with key `<key>` and value `<value>` in the database',
	usage: '<key> <value>',
	dev: false,
	db: true,
	guild: false,
	async run(client, message, args) {
		if (args.length < 3) return message.channel.send("You must specify a user, key and value.")
		let user = await client.usr(args[0]);
		if (!user) return message.channel.send("You must specify a user for this command to work!")
		let key = args[1];
		const val = args.slice(2).join(' ')
		if(!key || (!val)) return message.channel.send("You must provide a `<key>` and `<value>`, refer to <#726059916791644291> for further details")
		await client.db.set(key + user.id, val)
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully set ${key}${user.id} as ${client.trim(val, 1900)}`)
		})
	},
}