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
		const key = args[0];
		if (!key) return message.channel.send("You must provide a key (name of what you want to set) under the format of `" + message.guild.prefix + 'set <key> <value>`, for example `' + message.guild.prefix + 'set bal' + client.user.id + ' 1111`');
		const val = args.slice(1).join(' ');
		if (!val) return message.channel.send("You must provide a value of what you want to set in the database under the format of `" + message.guild.prefix + 'set <key> <value>`, for example `' + message.guild.prefix + 'set bal' + client.user.id + ' 1111`');
		client.db.set(key, val)
			.then(() => {
				message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription("Successfully set " + key)
				})
			})
				.catch((e) => {
					console.error(e);
					message.channel.send("There was an error whilst setting that in the database! `" + e + "`") 
				})
	},
}