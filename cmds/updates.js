const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "updates",
	aliases: ['updates', 'announcements'],
	category: 'utl',
	description: "Adds/removes the updates role. Haing it means you'll get pinged when there are new updates and additions to the bot.",
	async run(client, message, args) {
		const guild = client.guilds.cache.get(client.config.supportServer);
		const mem = guild.member(message.author.id);
		if (!mem) return message.channel.send(`Looks like you're not in my support server. Why not join? :D ${client.config.ssInvite}`);
		let perms = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
		perms = perms.split(";");
		if (perms[10] == "1") {
			perms[10] = "0";
			mem.roles.remove(client.config.roles.updates);
			await message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will no longer get mentioned for future updates and announcements.`)
			})
			await client.db.set("perms" + message.author.id, perms.join(";"))
		} else {
			mem.roles.add(client.config.roles.updates) 
			perms[10] = "1"
			await message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will now get mentioned for future updates and announcements.`)
			})
			await client.db.set("perms" + message.author.id, perms.join(";"))
		}
	}
}