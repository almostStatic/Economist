const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'cstmrl',
	aliases: ['cstmrl', 'cstmrls', 'roles'],
	description: 'Lists all of your assignable roles along with their keywords and names',
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author; 
		let data = await client.db.get('role' + usr.id);
		const entries = Object.entries(data);
		let resp = entries.map(x => `${x[0]}: ${x[1].name}`).join('\n');
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Custom Roles`)
			.setDescription(`\`\`\`\n${resp || "[ NONE lol ]"}\n\`\`\``)
			.setFooter("Roles are displayed under the format rolekeyword: rolename")
		})
	}
}