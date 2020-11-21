const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "level",
	aliases: ['level', 'xp'],
	category: 'utl',
	description: "View your or someone else's level & XP (only shows info from support server)",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		var user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = message.author;
		var lvl = await client.db.get("xplvl" + user.id) || 1;
		var xp = await client.db.get("xp" + user.id) || 0;
		xp = Number(xp);
		lvl = Number(lvl);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Experience [${lvl}]`)
			.setDescription("Whenever you send a message in the support server, you gain a random number of XP between 15 and 35. To prevent spam, XP will only be added once every 60 seconds.")
			.addField("Current Level", lvl, true)
			.addField("XP", `${xp}/${lvl * 200}`, true)
			.addField("XP Until Level Up", `${(lvl * 200) - xp}`, true)
		})
	}
}