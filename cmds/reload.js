const Discord = require('discord.js');

module.exports = {
	name: 'reload',
	aliases: ['r', 'reload'],
	description: 'Reloads a command',
	category: 'btsf',
	dev: true,
	category: 'btsf',
	usage: 'reload <command name or alias>',
	async run(client, message, args) {
		const msg = await message.channel.send(`Validating input & performing actions...`);
		const { commands } = client;
		if (!args.length) return msg.edit(`${client.config.emoji.err} You must specify a command to reload!`);
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return msg.edit(`${client.config.emoji.err} Command not found :c`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			return msg.edit(`${client.config.emoji.err} There was an error whilst attempting to reload the **${command.name}** command; \`${error.message}\``);
		}
		msg.edit(`${client.config.emoji.tick} Command **${command.name}** was reloaded (in ${Date.now() - message.createdAt} MS)`)
	},
};