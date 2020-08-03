const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'items',
	"aliases": ["inv", "inventory", "stuff", "items", "inventory"],
	description: "See what items another user has",
	async run(client, message, args) {
		let user = await client.usr(args[0] || message.author.id);
		if (!user) user = client.users.cache.get(message.author.id);

		let cp = await client.db.get(`chillpills${user.id}`) || 0;
		let dolp = await client.db.get(`fish0${user.id}`) || 0;
		let shark = await client.db.get(`fish1${user.id}`) || 0;
		let blowfish = await client.db.get(`fish2${user.id}`) || 0;
		let tropical = await client.db.get(`fish3${user.id}`) || 0;
		let fish = await client.db.get(`fish4${user.id}`) || 0;
		if (shark == undefined) shark = 0
		if (dolp == undefined) dolp = 0
		if (blowfish == undefined) blowfish = 0
		if (tropical == undefined) tropical = 0
		if (fish == undefined) fish = 0		
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Items`)
			.setDescription(`\`${message.guild.prefix}fish\` to earn some fish`)
			.addField(
				"Fish",
				`
:dolphin: Dolphins - ${message.author.com == 1 ? dolp : client.comma(dolp)}
:shark: Sharks - ${message.author.com == 1 ? shark : client.comma(shark)}
:blowfish: Blowfish - ${message.author.com ? blowfish : client.comma(blowfish)}
:tropical_fish: Tropical Fish - ${message.author.com == 1 ? tropical : client.comma(tropical)}
:fish: Fish - ${message.author.com == 1 ? fish : client.comma(fish)}
`, true
			)
			.addField("Other", `
${client.config.emoji.chill} Chill Pills - ${message.author.com == 1 ? cp : client.comma(cp)}
	`, true
			)
		})
	}
}