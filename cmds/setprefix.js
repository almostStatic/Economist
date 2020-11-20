const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'setprefix',
	aliases: ['setprefix', 'forceprefix'],
	category: 'btsf',
	dev: true,
	description: "This command allows bot staff to change the prefix for your server in case you've forgotten it or have trouble resetting it",
	async run(client, message, args) {
		if (args.length < 1) return message.channel.send(`${client.config.emoji.err} You must specify the ID of the guild whose prefix you wish to change.`);
		const guildid = args[0].toLowerCase();
		var guild = client.guilds.cache.get(guildid);
		if (!guild) return message.channel.send(`${client.config.emoji.err} A guild by that ID was not found! Please check the ID and try again.`);

		if (args.length < 2) return message.channel.send(`${client.config.emoji['err']} You must also specify a new prefix!`)
		var prefix = args[1].toLowerCase();
		if (prefix.length > 3 && (message.author.id != client.config.owner) || (!prefix)) return message.channel.send(`${client.config.emoji.err} The prefix may not be longer than 3 characters in length (to prevent embeds from exceeding the 2,000 chars limit).`);
		await client.db.set(`prefix${guild['id']}`, prefix);
		message.channel.send(`Successfully set prefix${message.guild.id} as \`"${prefix.toLowerCase()}"\``);
	},
};