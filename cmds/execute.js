const { MessageEmbed } = require("discord.js")
const { inspect } = require("util");
const ms = require("ms")

module.exports = {
	name: 'execute',
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	dev: true,
	async run(client, message, args) {
		if (args.length < 1) return message.channel.send("You must specify a user and a command to execute as the user")
		const user = await client.usr(args[0]);
		if (!user) return message.channel.send("I can't find that user.")
			user.tag = `${user.username}#${user.discriminator}`
			if (!args[1]) return message.channel.send("You must supply a valid command name/alias");
			let x = await client.db.get("com" + message.author.id)
			if (x) {
				user.com = true;
			}
			let noexec = await client.db.get("noexec" + user.id);
			if (user.id == client.config.owner && (message.author.id != client.config.owner)) {
				await client.db.set("stun" + message.author.id, {
					at: Date.now(),
					time: ms("24h"),
				});
				client.users.cache.get(client.config.owner).send(`${message.author.tag} (${message.author.id}) has tried to execute the ${args[1]} command on you.\nTheir message is as follows: ${message.content}`)
				message.channel.send(`You have been stunned for 24 hours because of trying to execute commands as the owner`)
			}
			if (noexec || (user.id == client.config.owner) && (message.author.id != client.config.owner)) {
				return message.channel.send("Commands may not be executed as this user.")
			}	
		const furtherArgs = args.slice(2);
			user.color = await client.db.get(`color${user.id}`) || client.config.defaultHexColor;
		const command = client.commands.get(args[1].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
		if (!command) return message.channel.send(`A command with that name/aias was not found! If this problem persists, please contact Static`);
		const Message = Object.assign(this, message, {
			author: user,
			channel: message.channel,
			guild: message.guild,
		});
	const mem = client.guilds.cache.get(client.config.supportServer).member(user);
	if (mem.roles.cache.has(client.config.roles.staff) && (message.author.id != client.config.owner)) {
		return message.channel.send('You may not execute commands as other staff members!')
	}
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
			command.run(client, Message, furtherArgs)
				.catch((x) => {
			message.channel.send("There seems to have been an error when executing this command as " + user.tag + ":\n" + inspect(x, { depth: 0 }), { code: 'js' })
				})
	},
}