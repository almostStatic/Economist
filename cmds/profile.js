const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'profile',
	aliases: ['profile'],
	description: 'shows a user\'s profile',
	async run(client, message, args) {
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		let cmds = await client.db.get("cmds" + usr.id) || 1;
		let color = await client.db.get('color' + usr.id) || client.config.defaultHexColor;
		let infcs = await client.db.get("infcs" + usr.id) || 0;
		const emb = new MessageEmbed()
		.setColor(color)
		.setTitle(`${usr.tag}'s Profile`)
		.setThumbnail(usr.displayAvatarURL({ dynamic: true }))
		.addField("Commands Used", message.author.com == 1 ? cmds : client.comma(cmds), true)
		.addField("Color Preference", color, true)
		.addField('Server Infractions', infcs, true)

		message.channel.send(emb);
	}
}