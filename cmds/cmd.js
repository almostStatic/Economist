const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'cmd',
	aliases: ['cmd'],
	category: 'btsf',
	description: 'Revoke/grant permissions for a user to use a certain command',
	dev: true,
	async run(client,message,args){
		if(args.length < 2) return message.channel.send("You must specify a user and a command name/alias in order for this command to work!")
	let usr;
	try {
		usr = await client.users.fetch(client.getID(args[0]))
	} catch (err) {
		usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('invalid user '))
	};
	if (usr.id == client.owner) return message.channel.send(`${usr.tag} will keep all permissions regardless. You may not use this command on them!`);
	let al = "x";
	const g = client.guilds.cache.get(client.config.supportServer).member(usr.id);
	if(!g) {
		al = false;
	}
	if (g.roles.cache.has(client.config.roles.staff)) {
		al = false;
	}
	const command = client.commands.get(args[1].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
	if (!command) return message.channel.send("A command with that name or alias was not found.");
	if (al != 'x') return message.channel.send("You can't use this command on other bot staff!")
	let x = await client.db.get(`cmds.${command.name}${usr.id}`);
	if (!x) {
		await client.db.set(`cmds.${command.name}${usr.id}`, true);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag} has lost access to the ${command.name} command`)
		});
		} else {
			await client.db.delete(`cmds.${command.name}${usr.id}`);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag}'s access to the ${command.name} command has been reinstated`)
			})
		}
	}
}