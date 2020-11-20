const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = {
	name: 'dose',
	aliases: ['dose', 'consume'],
	description: 'dose on something',
	category: 'ecn',	
	async run(client, message, args) {
		if (!args.length) return message.channel.send("The different types of consumables are: `chillpill`")
		let dose = args[0].toLowerCase();
		if (dose.startsWith("ch")) {
			let lastUsed = await client.db.get("chillc" + message.author.id);
				if (lastUsed) {
					let time = client.cooldown(lastUsed, Date.now(), ms('6h'));
					return message.channel.send(`You should wait ${time.hrs} hours and ${time.mins} minutes before consuming another ${client.config.emoji.chill}`);
				}
			let x = await client.db.get(`chillpills${message.author.id}`) || 0;
			if (Number(x) == 0) {
				return message.channel.send(`${client.config.emoji.chill} You don't have any chill pills!`)
			};
			await client.db.set(`chillpills${message.author.id}`, parseInt(x - 1));
			await client.cdb.delete(`strokec${message.author.id}`);
			await client.cdb.delete(`dialc${message.author.id}`);		
			await client.cdb.delete(`sentc${message.author.id}`)
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has consumbed 1 ${client.config.emoji.chill}; all existing cooldowns have been cleared!`)
			})
			await client.cdb.set(`chillc${message.author.id}`, Date.now(), ms("6h"));
		}
	}
}