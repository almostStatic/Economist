const Discord = require('discord.js');

module.exports = {
	name: 'rolename',
	aliases: ["rolename", 'rolename','rn'],
	desc: "Change the name of your assignable role!",
	async run(client, message, args) {
		let name = args.join(' ');
		let id = await client.db.get('role' + message.author.id);
		if (!id) return message.channel.send(`${client.config.emoji.err} You don't own a custom role! \`${message.guild.prefix}myrole\``);
		let role = message.guild.roles.cache.get(id);
		if (!role) return message.channel.send(`${client.config.emoji.err} I cannot find your custom role!`)
		role.setName(name, `Custom role name changed by ${message.author.tag}`)
		return await message.channel.send("", {
			embed: new Discord.MessageEmbed()
			.setDescription(`${client.config.emoji.tick} Successfully changed role name to ${name}`)
			.setColor(message.author.color)
		});
	},
};