const { MessageEmbed, escapeMarkdown } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'stun',
	aliases: ['stun'],
	dev: true,
	description: 'stuns a user, preventing them from using any commands',
	async run(client, message, args) {
		if(!args.length || (isNaN(args[1]))) return message.channel.send("You must specify the user to stun, along with the stun time (in minutes)");
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('invalid user '))
		};
		if(!usr) return;		
		await client.db.set('stun' + usr.id, {
			at: Date.now(),
			time: parseInt(args[1] * ms('1m')),
		}, parseInt(args[1] * ms('1m')))
				message.channel.send(`${client.config.emoji.tick} Successfully stunned **${escapeMarkdown(usr.tag)}** for ${client.comma(args[1])} minutes.`)
	} 
}