const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'warn',
	aliases: ['warn', 'punish'],
	description: `Warn a user`,
	category: 'mod',
	async run(client, message, args) {
		if (args.length < 2) {
			return message.channel.send(`${client.config.emoji.err} Incorrect usage; try using \`${message.guild.prefix}warn <user> <reason>\``)
		};
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

		//add infractions:
		let infcs = await client.db.get("infcs" + usr.id) || 0;
			infcs = Number(infcs);
		const newInfcs = infcs + 1;
		await client.db.set("infcs" + usr.id, newInfcs);

		const reason = args.slice(1).join(' ');
	
		let logsMessage = await client.channels.cache.get(client.config.channels.modlog).send({
			embed: new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Warned")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`, true)
			.addField("User", `${usr.tag} | ${usr.id}`, true)
			.addField('Infractions', newInfcs)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Warned")
		});

		let emb = new MessageEmbed()
		.setDescription(`You have received a warning in ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag, true)
		.addField("Total Infractions", newInfcs, true)
		.addField("Reason", reason);

		message.channel.send(`${client.config.emoji.tick} ${usr.tag} has been warned and was sent the following message:`);
		message.channel.send(emb);
		await client.users.cache.get(usr.id).send(emb).catch((x) => {});
	}
};