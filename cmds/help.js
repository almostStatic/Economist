const { MessageEmbed } = require('discord.js');
const rm = require('discord.js-reaction-menu');
const ms = require('ms');

module.exports = {
	name: 'help',
	aliases: ['help', 'helpme', 'cmdhelp'],
	description: "*helps* you?",
	async run(client, message, args) {
		if (message.content.toLowerCase().endsWith('-cmds')) {
			//;eval "1234567890".match(/.{1,5}/g);
			var count = 1;
			const string = client.commands.map(x => `${count++}. \`${x.name}\`: ${x.description}`).join('\n');
			let embeds = []
			const map = string.match(/[^]{1,2048}/g);
			for (const x in map) {
				embeds.push(new MessageEmbed().setColor(message.author.color).setTitle("Commands Map").setDescription(map[x]))
			};
			return new rm.menu(message.channel, message.author.id, embeds, ms('10m'))
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
				.addField("Staff Only", command.dev ? 'true' : 'false', true)
			})
		};
		const emb = new MessageEmbed()
		.setColor(message.author.color)
		.setDescription("**__COMMANDS LIST__**\n" + client.commands.map(x => x.name).join(', '))
		.addField("Support Server", `You can join our support server to ask for help, or just to say 'hi'\n\n[Join](${client.config.ssInvite})`)
		message.channel.send(
			`
**__Thanks for showing some interest in Economist.__**

Economist is a bot designed by \`${client.users.cache.get(client.config.owner).tag}\` and is mainly an **Economy** bot. Economy refers to money; we try to offer an easy but fun experience for both new and experienced users. It was created on ${client.user.createdAt}

Additionally, we have incorporated the concept of a **stun** system, meaning that a User can not use any commands for the period in which they are *stunned*. The maximum stun time is 10 minutes. Stuns do not stack; if a User is already stunned then their current sturn will be overriden with the new one. 

Below will be a list of commands; to view a description of each please use \`${message.guild.prefix}help <command name>\`.

You can invite me by using this link: <${client.config.inv}>

| **NOTE:** This bot is still in active development; many features may be incomplete or break regularly. I can not guarantee a 100% error-free experience. If you find any bugs, please report them by using \`${message.guild.prefix}bug short description | long, in depth description\` 
			`
		, { embed: emb })

	}
}