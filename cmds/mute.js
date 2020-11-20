const { MessageEmbed } = require(`discord.js`);
const ms = require('ms');

module.exports = {
	name: 'mute',
	aliases: ['mute'],
	description: 'Mutes a user',
	category: 'mod',
	async run(client, message, args) {
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
		let member = message.guild.member(usr.id);
		if (!member) return message.channel.send(`${client.config.emoji.err} The specified user is not a member of this server`);
		if (member.roles.cache.has(client.config.roles.mod.normal) && (message.author.id == client.owner)) {
			return message.channel.send(`${client.config.emoji.err} You're not allowed to mute a moderator!`);
		};

		await member.roles.add(client.config.roles.muted);

		let infc = await client.db.get("infcs" + member.id) || 0;
			infc = Number(infc);
		await client.db.set("infcs" + member.id, infc + 2);
		let amt = parseInt(args[1]);
		if(isNaN(amt) || (!args[1])) return message.channel.send(`${client.config.emoji.err} You must provide a valid length (in minutes). For permanent mutes, use 0 as the length.`)
		await client.db.set(`mute${member.id}`, {
			at: Date.now(),
			length: amt == 0 ? 0 : amt * ms('1m'),
		})
		let reason = args.slice(2).join(' ');
		if (!reason) reason = "Moderator didn't specify a reason.";

		let logsMessage = await client.channels.cache.get(client.config.channels.modlog).send({
			embed: new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Muted")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`, true)
			.addField("User", `${member.user.tag} | ${member.id}`, true)
			.addField('Infractions', infc + 2)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Muted")
		});
		message.channel.send(`${client.config.emoji.tick} ${member.user.tag} has been muted ${amt == 0 ? `permanently` : `for ${amt} minutes`} and was sent the following message:`)
		let dm = new MessageEmbed()
		.setDescription(`You have received a ${amt == 0 ? 'permenant' : `${amt} minute`} mute from ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag, true)
		.addField('Length', amt == 0 ? "Infinite" : `${amt} minutes`, true)
		.addField("Total Infractions", infc + 2, true)
		.addField("Reason", reason);
		message.channel.send(dm);
		member.send(dm)
			.catch((x) => {});
		if (amt != 0) {
		setTimeout(async() => {
			let m = await client.db.get('mute' + member.id);
			if (!m) return;
			member.roles.remove(client.config.roles.muted);
			message.channel.send(`${client.config.emoji.tick} ${usr.tag} has been unmuted (mute time over)`);
			member.send({
				embed: new MessageEmbed()
				.setDescription(`You have been unmuted from ${message.guild.name}`)
				.setColor(client.config.colors.green)
				.addField("Moderator", client.user.tag, true)
			 .addField("Reason", "Time's up!", true)
			});
			await client.db.delete('mute' + member.id);
		}, amt * ms('1m'))
		};
	},
}