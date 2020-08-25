const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rolemembers',
	aliases: ['rolemem', 'rolemembers'],
	description: 'View all the members of a specified role; can be either name mention or ID',
	async run(client, message, args) {
		if(!args.length) return message.channel.send("You need to like provide a role name/id")
		const role =  message.guild.roles.cache.find(x => x.name.toLowerCase() == args.join(' ').toLowerCase()) || message.guild.roles.cache.find(x => x.id.toLowerCase() == args.join(' ').toLowerCase()) || message.guild.roles.cache.find(x => x.name.toLowerCase().startsWith(args.join(' ').toLowerCase())) || message.guild.cache.get(message.mentions.roles.first().id);
		if (!role) return message.channel.send("Can't seem to find that role.. try again!");
		var counter = 1;
		const members = role.members.map(x => `${counter++}. ${x.user.tag} (${x.id})`).join('\n')
		if (members.length < 2048) {
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.setColor)
				.setTitle("Members with the " + role.name + " role")
				.setDescription(client.trim(members, 2048))
			});
		};
	message.author.send(members, { split: true })
		.then((x) => message.reply("Check your DMs bud"))
			.catch((x) => message.reply("You need to enable your DMs in order for me to send youa list of members who have this role."))
	},
};