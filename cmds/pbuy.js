const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "pbuy",
	aliases: ["pbuy"],
	description: "Purchase something and use up some of your XP",
	async run(client, message, args) {
		if (!args.length) return message.channel.send(`You must follow the format of: \`${message.guild.prefix}pbuy <item>\``);
		const item = args[0].toLowerCase();
		let perms = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0";
		perms = perms.split(";");
		var xp = await client.db.get("xp" + message.author.id) || 0;
				xp = Number(xp);
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
		const price = client.config.items[res].price;
		const role = client.config.items[res].role;
		const name = client.config.items[res].name;
		if (xp - price < 0) return message.channel.send(`You don't have enough XP to purchase the ${name} permission! You need to have a minimum XP of ${price} XP before purchasing this item. To view your current XP, use \`${message.guild.prefix}level\``);
		const newXP = xp - price;
		const ss = client.guilds.cache.get(client.config.supportServer).members.cache.get(message.author.id);
		if (!ss) return messae.channel.send(`You must be in the support server in order to purchase permissions. Why don't you join it? ${client.config.ssInvite}`);
		if (ss.roles.cache.has(role)) {
			return message.channel.send(`You already have that permission!`);
		};
		if (Object.keys(client.config.indexes).includes(name)) {
			if (perms[client.config.indexes[name]] == "1") return message.channel.send(`You already have ${name}`);
			perms[client.config.indexes[name]] = "1";
			message.channel.send("new perms="+perms.join(";"));
			await client.db.set("perms" + message.author.id, perms.join(";"));
		} else {
			message.channel.send("If you bought a role and are not in the support server, then you won't receive it. Please ensure that you're a member of the server. If not, join by using the `" + message.guild.prefix + "hub` command.")
		}
		ss.roles.add(role)
			.catch((x) => {});
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully bought the ${name} permission!`)
		})
		await client.db.set("xp" + message.author.id, newXP);
	}
}