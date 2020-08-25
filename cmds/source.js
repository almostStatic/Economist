const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const rm = require('discord.js-reaction-menu');

module.exports = {
	name: 'source',
	aliases: ['source', 'src'],
	description: 'view bots source code',
	async run (client, message, args) {
		if (message.author.id != client.config.owner) return message.reply('nooooo loool')
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
		if (!args.length) {
			return message,channel.send(`${client.config.emoji.err} You need to provide a command name!`);
		};
		cmd = args[0].toLowerCase();
		fs.readFile(`./cmds/${command.name}.js`, (err, file) => {
			if (err) {
				console.log(err)
				return msg.edit(`${process.env.re} I can't find that file.`)
			};
			var count = 1;
			const string = file.toString();
			let embeds = []
			const map = string.match(/[^]{1,2035}/g);
			for (const x in map) {
				embeds.push(new MessageEmbed().setColor(message.author.color).setTitle(`Command Source Code | ${command.name}`).setDescription(`\`\`\`js\n${map[x]}\n\`\`\``))
			};
			return new rm.menu(message.channel, message.author.id, embeds, ms('10m'))

		});
	}
}