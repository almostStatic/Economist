const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

module.exports = {
	name: 'fetchuser',
	aliases: ['fetchuser', 'fetch-user', "fu"],
	category: "own",
	botDeveloper: true,
	description: 'fetches a user (as partial)',
	usage: 'fetchuser <id>',
	async run(client, message, args) {
		function getUserFromMention(mention) {
			if (!mention) return;
			if (mention.startsWith('<@') && mention.endsWith('>')) {
				mention = mention.slice(2, -1);
				if (mention.startsWith('!')) {
					mention = mention.slice(1);
				}
				return mention;
			};
		};		
		if (!args.length) return message.channel.send(`${client.config.emoji.err} You need mention a user or provide a valid ID!`);
		const msg = await message.channel.send(`Fetching user...`);
		let user;
			if (message.mentions.users.first()) {
				user = await client.users.fetch(message.mentions.users.first().id);
			} else {
				user = await client.users.fetch(args[0]);
			};
		if (!user) return msg.edit(`${client.config.emoji.err} I can't find that user.`);
		const data = inspect(user, { depth: 100000000 });
		msg.edit('', { 
			embed: new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(message.author.color)
			.setDescription("```js\n" + data + "\n```")
			.setFooter(`in ${Date.now() - msg.createdTimestamp} MS`)
		});
	},
};