const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'number',
	aliases: ['number'],
	description: "Grab a user's number and dial them with $this.guild.prefixdial <number>",
	async run(client, message, args) {
		let fb = await client.db.get('phonebook' + message.author.id);
		if (!fb) return message.channel.send(`${client.config.emoji.err} You don't own a ${client.config.emoji.phonebook} ! \`${message.guild.prefix}buy 3\``)
//		if (!args.length) return message.channel.send(`${client.config.emoji.err} You must specify a user who's number you wish to get`)
		if(!args.length) args = [message.author.id];
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.channel.send(`${client.config.emoji.err} An invalid user was provided.`))
		};		
		let num = await client.db.get('number' + usr.id);
		let count = await client.db.get('dialcount' + usr.id) || 0;
		if (!num) return message.channel.send(`${usr.tag} does not own a :iphone:. As a result, they do not have a phone number.`);

		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Phone`)
			.setDescription(`:iphone: Number - ${num}\n:telephone_receiver: Number of times dialed - ${client.comma(count)}`)
		})	
	}
}