const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "updates",
	aliases: ['updates', 'announcements'],
	description: "Adds/removes the updates role. Haing it means you'll get pinged when there are new updates and additions to the bot.",
	async run(client, message, args) {
		const guild = client.guilds.cache.get(client.config.supportServer);
		const mem = guild.member(message.author.id);
		if (!mem) return message.channel.send(`Looks like you're not in my support server. Why not join? :D ${client.config.ssInvite}`);
		if (mem.roles.cache.has(client.config.roles.updates)) {
			mem.roles.remove(client.config.roles.updates);
			await message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will no longer get mentioned for future updates and announcements.`)
			})
		} else {
			mem.roles.add(client.config.roles.updates) 
			await message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will now get mentioned for future updates and announcements.`)
			})			
		}
	}
}