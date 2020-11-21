const Discord = require('discord.js');

module.exports = {
	name: 'set',
	aliases: ['set', 's'],
	description: 'sets a value with key `<key>` and value `<value>` in the database',
	usage: '<key> <value>',
	dev: false,
	category: 'btsf',
	db: true,
	guild: false,
	async run(client, message, args) {
		if (args.length < 3) return message.channel.send("You must specify a user, key and value.");
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send("You must specify a user for this command to work!");
		let key = args[1];
		let val = args.slice(2).join(" ");
		if(!key || (!val)) return message.channel.send("You must provide a `<key>` and `<value>`, refer to <#726059916791644291> for further details");
		if (!isNaN(val)) val = Number(val);
		if (val.toString().toLowerCase() == "true") val = true;
		if (val.toString().toLowerCase() == "false") val = false;
		await client.db.set(key + user.id, val)
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully set ${key}${user.id} as ${client.inspect(client.trim(val, 1800))} with type \`${typeof val}\``)
		})
		if (typeof val == "boolean") {
			 message.channel.send("Due to algebraic operations performed by computers on booleans, it's not possible to set values as false within its primitive data type. If this is done, then the value become void.");
		};		
		client.channels.cache.get(client.config.channels.set)
			.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setTimestamp()
				.setFooter(`${message.author.tag} | ${message.author.id}`)
				.setTitle(`Value Updated`)
				.addField("Key", key, true)
				.addField("New Value", val, true)
				.addField("\u200b", "\u200b", true)
				.addField("Target User", `${user.tag} | ${user.id}`)
				.addField("Data Type", `\`${typeof val}\``, true)
				.setThumbnail(message.author.displayAvatarURL())
			})
	},
}