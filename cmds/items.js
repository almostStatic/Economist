const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'items',
	"aliases": ["inv", "inventory", "stuff", "items", "inventory"],
	description: "See what items another user has",
	async run(client, message, args) {
		let user = await client.usr(args[0] || message.author.id);
		if (!user) user = client.users.cache.get(message.author.id);

		let cp = await client.db.get(`chillpills${user.id}`) || 0;
		let dolp = await client.db.get(`:dolphin:${user.id}`) || 0;
		let shark = await client.db.get(`:shark:${user.id}`) || 0;
		let blowfish = await client.db.get(`:blowfish:${user.id}`) || 0;
		let tropical = await client.db.get(`:tropical_fish:${user.id}`) || 0;
		let fish = await client.db.get(`:fish:${user.id}`) || 0;
	
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Items`)
			.setDescription(`\`${message.guild.prefix}fish\` to earn some fish`)
			.addField(
				"Fish",
				`
:fish: Fish - ${client.comma(fish)}
:dolphin: Dolphins - ${client.comma(dolp)}
:shark: Sharks - ${client.comma(shark)}
:blowfish: Blowfish - ${client.comma(blowfish)}
:tropical_fish: Tropical Fish - ${client.comma(tropical)}
`, true
			)
			.addField("Other", `
${client.config.emoji.chill} Chill Pills - ${client.comma(cp)}
	`, true
			)
		})
	}
}