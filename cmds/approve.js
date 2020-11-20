const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: "approve",
	aliases: ["approve"],
	category: 'utl',	
	description: 'approve a bug. All this does is post it in #announcements lol',
	dev: true,
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must provide a bug ID of the bug you wish to approve")
		const id = args[0];
		const reason = args.slice(1).join(' ');
		message.delete().catch((x) => {});
		const val = await client.db.get(`bugr${id}`);
		if (!val) return message.channel.send(`${client.config.emoji.err} No bug report with ID "${id}" was found.`);
		client.channels.cache.get(client.config.channels.bug)
			.messages.fetch({
				limit: 1,
				around: val.msg,
			})
				.then(async(col) => {
					const rec = new MessageEmbed()
						.setColor("#6ae691")
						.setTitle(val.title)
						.setDescription(`${client.config.emoji.tick} **Bug Report #${val.number} was approved by ${escapeMarkdown(message.author.tag)}**`)
						col.first().edit('', {
							embed: rec,
						});
				client.channels.cache.get('723593301692776518')
					.send(`Bug reported by ${client.users.cache.get(val.author).tag || "UNKNOWN_USER#0000"} was approved by ${message.author.tag}`, {
						embed: new MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(val.title)
						.setDescription(col.first().embeds[0].description)
						.setTimestamp(val.at)
					})		
			})
				.catch((x) => message.channel.send("There was an error: `" + x + "`"));
			message.channel.send(`${client.config.emoji.tick} You've approved bug with ID **${id}**`);
		await client.db.delete(`bugr${id}`);
		client.users.cache.get(val.author)
			.send(`Your bug (${id}) has been approved by ${message.author.tag}\n${reason ? `${message.author.tag}'s Comments: ${reason}` : ""}`)
				.catch((x) => {});
	}
}