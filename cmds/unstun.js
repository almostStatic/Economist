const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unstun',
	aliases: ['unstun', 'un-stun'],
	dev: true,
	description: 'unstuns a user, allowing them to use commands',
	async run(client, message, args) {
		if(!args.length) return message.channel.send("You must specify the user to unstun!");
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('invalid user '))
		};
		if(!usr) return;
		Data = await client.db.get('stun' + usr.id);
		if (!Data) return message.channel.send(`${usr.tag} is not stunned`)
		await client.db.delete('stun' + usr.id);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully unstunned ${usr.tag}`)
		})
	} 
}