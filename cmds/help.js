const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'help',
	aliases: ['help', 'helpme', 'cmdhelp'],
	description: "*helps* you?",
	category: 'utl',
	async run(client, message, args) {
		if (message.content.toLowerCase().endsWith('-cmds')) {
			//;eval "1234567890".match(/.{1,5}/g);
		/*	var count = 1;
			const string = client.commands.map(x => `${count++}. \`${x.name}\`: ${x.description}`).join('\n');
			let embeds = []
			const map = string.match(/[^]{1,2048}/g);
			for (const x in map) {
				embeds.push(new MessageEmbed().setColor(message.author.color).setTitle("Commands Map").setDescription(map[x]))
			};
			return new rm.menu(message.channel, message.author.id, embeds, ms('10m'))*/

		};
		if (args.length) {
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

			if (!command) return message.channel.send("Please try to include a valid command name/alias!");

			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(message.author.displayAvatarURL())
				.setFooter(`Requested by ${message.author.tag}`)
				.setTitle('Command Help | ' + command.name)
				.setDescription(command.description)
				.addField("Aliases", command.aliases.join(', '), true)
				.addField("Staff Only", command.dev ? 'Yes' : 'No', true)
			})
		};

	message.channel.send({
		embed: new MessageEmbed()
		.setTitle("Command Help")
		.setColor(message.author.color)
		.setDescription(`Here are some commands which can be used by members; arranged in categories! You can use \`${message.guild.prefix}help <command name>\` for some extra information on a certain command.`)
		.addField("Economy Commands", client.commands.filter((x) => x.category === 'ecn').map((x) => `\`${x.name}\``).join(', '))
		.addField("Staff Commands", client.commands.filter((x) => x.category === 'btsf').map((x) => `\`${x.name}\``).join(', '))
		.addField("Pet Commands", client.commands.filter((x) => x.category === 'pet').map((x) => `\`${x.name}\``).join(', '))
		.addField("Phone Commands", client.commands.filter((x) => x.category === 'phn').map((x) => `\`${x.name}\``).join(', '))
		.addField("Moderator Commands", client.commands.filter((x) => x.category === 'mod').map((x) => `\`${x.name}\``).join(', '))
		.addField("Nerd Commands", client.commands.filter((x) => x.category === 'nrd').map((x) => `\`${x.name}\``).join(', '))
		.addField("Utility Commands", client.commands.filter((x) => x.category === 'utl').map((x) => `\`${x.name}\``).join(', '))
		.addField("Fun Commands", client.commands.filter((x) => x.category === 'fun').map((x) => `\`${x.name}\``).join(', '))		
		.addField("Owner Commands", client.commands.filter((x) => x.category === 'own').map((x) => `\`${x.name}\``).join(', '))})
	}
}