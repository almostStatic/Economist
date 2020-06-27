const { MessageEmbed } = require("discord.js")
const { inspect } = require("util");

module.exports = {
	name: 'execute',
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	dev: true,
	async run(client, message, args) {
		if (args.length < 1) return message.channel.send("Invalid Arguments.")
		const user = await client.usr(args[0]);
			user.tag = `${user.username}#${user.discriminator}`
			if (!args[1]) return message.channel.send("You must supply a valid command name/alias");
		const furtherArgs = args.slice(2);
			user.color = await client.db.get(`color${user.id}`) || client.config.defaultHexColor;
		const command = client.commands.get(args[1].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
		if (!command) return message.channel.send(`A command with that name/aias was not found! If this problem persists, please contact Static`);
		const Message = Object.assign(this, {
			author: user,
			channel: message.channel,
			guild: message.guild,
		});
	const mem = client.guilds.cache.get(client.config.supportServer).member(user);
	const cantUsed = [
	"Why would you want to use this command?",
	"You're not cool enough to use this command!",
	"no can do pal",
	"hm.",
	"You lack sufficent permissions required in order to use this command. L",
	"Permissions are bad, Mkay",
]
	if (!command.guild) command.guild = false;
	if (!command.dev) command.dev = false;
	if (!command.col) command.col = false;
	if (!command.nerd) command.nerd = false;
	if (!command.disabled) command.disabled = false;
	if (!command.supreme) command.supreme = false;

	if (command.disabled) return message.channel.send({ 
		embed: new Discord.MessageEmbed()
		.setColor('#da0000')
		.setDescription(`This command has been disabled by ${client.users.cache.get(client.config.owner).tag}`)
	 })

	if (command.nerd && (!mem.roles.cache.has(client.config.roles.nerd))) {
		return message.channel.send(cantUsed[Math.floor(Math.random() * cantUsed.length)]);		
	};

	if (command.dev && (!mem.roles.cache.has(client.config.roles.staff))) {
		return message.channel.send(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	};

	if (command.db && (!mem.roles.cache.has(client.config.roles.db))) {
		return message.channel.send(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.supreme && (!mem.roles.cache.has(client.config.roles.supreme))) {
		return message.channel.send(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.col && (!mem.roles.cache.has(client.config.roles.col))) {
		return message.channel.send(`You're not colourful enough to use this command!`);
	};			
		try {
			command.run(client, Message, furtherArgs)
		} catch (err) {
			console.log(err)
			message.channel.send(inspect(error, { depth: 0 }))
		}
	},
}