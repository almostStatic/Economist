const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'infraction',
	aliases: ['infraction', 'infract'],
	description: "Add/remove a user's infractions",
	async run(client, message, args) {
		if (args.length < 3) {
			return message.channel.send(`${client.config.emoji.err} Incorrect Usage; try using \`${message.guild.prefix}infraction <user> <amount> <+|->\``);
		}
		if (!message.member.roles.cache.some(r=>[client.config.roles.mod.trial, client.config.roles.mod.normal].includes(r.id))) {
			return message.channel.send(`${client.config.emoji.err} You need to be a moderator in order to use this command`)
		};
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => {});
		};		
		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);

		if (isNaN(args[1])) return message.channel.send("You must include a valid base-10 denary number!")
		let amt = Number(args[1]);
		const Operation = args[2];
/*		if (!Operation.startsWith('+') || (!Operation.startsWith('-'))) {
};*/
		let infcs = await client.db.get("infcs" + usr.id) || 0;
			infcs = Number(infcs);
		if (Operation.startsWith("+")) {
			const ans = (infcs + amt);
			let err;
			await client.db.set(`infcs${usr.id}`, ans)
				.catch((x) => err = x);
			if (err) {
				return message.reply("There was an error; " + err);	
			};
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully added ${amt} infractions to ${usr.tag}`)
			})
		} else if (Operation.startsWith('-')) {
			const ans = (infcs - amt);
			let err;
			await client.db.set(`infcs${usr.id}`, ans)
				.catch((x) => err = x);
			if (err) {
				return message.reply("There was an error; " + err);	
			};
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully removed ${amt} infractions from ${usr.tag}`)
			})
		} else {
			return message.channel.send("Your third argument (operation) must either start with `+` (to add), or `-` (to subtract)");
		}
	}
}