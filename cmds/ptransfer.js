const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ptransfer',
	aliases: ['ptransfer'],
	description: "Transfers one of your owned items to another user; 2 hours' cooldown",
	category: 'utl',
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send(`Please use the following format: \`${message.guild.preifx}transferitm <user> <item>\``);
		const user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.reply("You must mention a user!")
		let perms = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0";
		let userPerms = await client.db.get("perms" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0";
		perms = perms.split(";");
		userPerms = userPerms.split(";");
		const item = args[1].toLowerCase();
		const items = Object.keys(client.config.items);
		var res; 
		items 
			.forEach((i) => {
				if (typeof res == "string") {
					//already found item to purchase 
					return;
				} else {
					if (item.startsWith(i)) {
						res = i;
					} else {
						return;
					}
					return;
				}
			});
		
		if (typeof res != "string") return message.channel.send(`That's not a valid permission! The valid purchasable permissions are: ${Object.entries(client.config.items).map((x) => `\`${x[1].name}\``).join(", ")}`);
		const name = client.config.items[res].name;

		const ss = await client.guilds.cache.get(client.config.supportServer).members.fetch(user.id).catch((x) => {});
		if (!ss) message.channel.send(`The person to whom you wish to transfer this item to must be in the support server. If you transferred a role, then they will not receive it.`);

		const authorSS = await client.guilds.cache.get(client.config.supportServer).members.fetch(message.author.id).catch((x) => {});		
		if (!authorSS) return message.channel.send(`You must be in the support server in order to use this command—use the \`${message.guild.prefix}support\` command to get an invite!`);
		if (!authorSS.roles.cache.has(client.config.items[res].role)) {
			return message.channel.send(`You must have this permission before transferring it to other users. To view your currently owned items, please use \`${message.guild.prefix}ditems\``);
		};
		
		if (Object.keys(client.config.indexes).includes(name)) {
			if (perms[client.config.indexes[name]] == "0") return message.channel.send(`You do not have ${name} thus you cannot transfer it!`);
			perms[client.config.indexes[name]] = "0";
			userPerms[client.config.indexes[name]] = "1";
			await client.db.set("perms" + message.author.id, perms.join(";"));
			await client.db.set("perms" + user.id, userPerms.join(";"));
		} else {
			if (!ss) return message.channel.send("The person to whom you wish to transfer this role to is not in the support sever! They can join by using the `" + message.guild.prefix + "hub` command.")
		}

		authorSS.roles.remove(client.config.items[res].role)
			.catch((x) => {})
		ss.roles.add(client.config.items[res].role)
			.catch((x) => {})
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(
				`${message.author.tag} has lost the ${client.config.items[res].name} permission\n${user.tag} has received the ${client.config.items[res].name} role`
			)
		})
	},	
};