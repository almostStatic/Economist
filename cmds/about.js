const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'about',
	aliases : ['about', 'abt'],
	category: 'utl',
	description: 'See stuff about the bot',
	async run(client, message, args) {
		const emb = new MessageEmbed()
		.setColor(message.author.color)
		.setDescription("**__COMMANDS LIST__**\n" + client.commands.map(x => x.name).join(', '))
		.addField("Support Server", `You can join our support server to ask for help, or just to say 'hi'\n\n[Join](${client.config.ssInvite})`)
		message.channel.send(
			`
**__Thanks for showing some interest in Economist.__**

${client.user.username} is a bot designed by \`${client.users.cache.get(client.config.owner).tag}\` and is mainly an **Economy** bot. Economy refers to money; we try to offer an easy but fun experience for both new and experienced users. It was created on ${client.user.createdAt}

Additionally, we have incorporated the concept of a **stun** system, meaning that a User can not use any commands for the period in which they are *stunned*. The maximum stun time is 10 minutes. Stuns do not stack; if a User is already stunned then their current sturn will be overriden with the new one. 

Below will be a list of commands; to view a description of each please use \`${message.guild.prefix}help <command name>\`.

You can invite me by using this link: <${client.config.inv}>

| **NOTE:** This bot is still in active development; many features may be incomplete or break regularly. I can not guarantee a 100% error-free experience. If you find any bugs, please report them by using \`${message.guild.prefix}bug short description | long, in depth description\` 
			`)
	message.channel.send({ embed: emb })
	}
}