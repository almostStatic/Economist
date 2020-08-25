const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'giverole',
	aliases: ['giverole', 'gr'],
	description: "Assigns an assignable role to the mentioned user, only useable by the bot owner.",
	async run(client, message, args) {
		if(message.author.id != client.config.owner) return message.channel.send(`${client.config.emoji.err} You don't have permission to use this command! :-(`);

		if (args.length < 2) return message.channel.send("You must specify a role<keyword> and member for this command to work!");
		"~giverole <user> <keyword> <hoist>"
		let usr = await client.usr(args[0]).catch((x) => {})
		if (!usr) return message.channel.send("Whoops! I can't find that user");

		let Name = `${usr.tag}'s New Custom Role`;
		let roles = await client.db.get('role' + usr.id) || {};
		if (typeof roles != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#RolesOwnedData must be of type Object or null`\nContact an admin asking them to remove your role data!");

		let kw = args[1].toLowerCase(); //role keyword
		if (Object.keys(roles).includes(kw)) {
			return message.channel.send(`${client.config.emoji.err} That user already has a role under that keyword! Try another.`);
		};

		if(!args[2]) args[2] = '';
		let hoist = args[2].includes("-h")
		const role = await message.guild.roles.create({
			data: {
				name: Name,
				position: 9,
				color: "#000000",
				mentionable: false,
				hoist: hoist == true ? true : false,
				permissions: 0,
			},
			reason: `Creating an assignable role for ${usr.tag}`
		});
		args[1] = args[1].toLowerCase();
		const data = Object.assign({}, roles, { [args[1]]: { name: Name, id: role.id, color: '#000000' } });
		await client.db.set('role' + usr.id, data);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${usr.tag} now has an assignable role (ID ${role.id})`)
		});
	}
};