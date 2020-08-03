const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'giverole',
	aliases: ['giverole', 'gr'],
	description: "Assigns an assignable role to the mentioned user, only useable by the bot owner.",
	async run(client, message, args) {
				if(message.author.id != client.config.owner) return message.channel.send(`${client.config.emoji.err} You don't have permission to use this command! :-(`);
				if (!args.length) return message.channel.send("You must specify a member for this command to work!")
		let usr;
			try {
				usr = await client.users.fetch(client.getID(args[0]))
			} catch (err) {
				usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('An invalid user was provided.'))
			};
		if (!usr) return message.channel.send("Whoops! I can't find that user");
		let Name = `${usr.tag}'s New Custom Role'`
		if(!args[1]) args[1] = '';
		let hoist = args[1].includes("-h")
		const role = await message.guild.roles.create({
			data: {
				name: Name,
				position: 9,
				color: "RANDOM",
				mentionable: false,
				hoist: hoist == true ? true : false,
				permissions: 0,
			},
			reason: `Creating an assignable role for ${usr.tag}`
		});
		await client.db.set('role' + usr.id, role.id);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${usr.tag} now has an assignable role (ID ${role.id})`)
		});
	}
};