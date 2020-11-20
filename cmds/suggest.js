const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'suggest',
	aliases: ['suggest', 'addsmthnew'],
	description: 'Suggest a new idea to be added to the bot; will be posted in <#758598514623643690>',
	category: 'utl',
	async run(client, message, args) {
		const blck = await client.cdb.get('nsg' + message.author.id);
		if (blck) return message.reply("You have been blacklisted from sending suggestions, RIP.") 
		if (!args.length) return message.channel.send(`You must provide a suggestion for me to uhh... suggest?`)
 	var suggest = args.join(' ');
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Aight mate, I've posted your suggestion in our support server. [Join](${client.config.ssInvite})`)
		});
		client.channels.cache.get(client.config.channels.suggestions)
			.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`New Suggestion`)
				.setThumbnail(message.author.displayAvatarURL())
				.setDescription(suggest)
				.setFooter(`${message.author.tag} (${message.author.id})`)
			})
				.then((m) => { m.react('👍'); m.react('👎') })
	}
}