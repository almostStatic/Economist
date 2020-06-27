const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'shop',
	aliases: ['s', 'shop'],
	description: 'View the current shop!',
	async run(client, message, args) {
		let bal = await client.db.get('bal' + message.author.id) || 0;
		let owns = {
			fishing_rod: await client.db.get('fish_rod' + message.author.id),
			phonebook: await client.db.get('phonebook' + message.author.id),
			phone: await client.db.get('phone' + message.author.id),
		}
		const shop = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle(`Shop - ${message.author.tag}`)
		.setDescription(`Current Balance - :dollar: ${client.comma(bal)}\n\n[1] ${client.config.emoji.fishing_rod}${owns.fishing_rod ? ` ${client.config.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to go fishing via \`${message.guild.prefix}fish\`; costs :dollar: 25\n[2] ${client.config.emoji.mobile_phone}${owns.phone ? ` ${client.config.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to comunicate with others via \`${message.guild.prefix}dial\`; costs :dollar: 750\n[3] ${client.config.emoji.phonebook}${owns.phonebook ? ` ${client.config.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to view other users' phone numbers via \`${message.guild.prefix}number\`; costs :dollar: 250`)
		.addField(`Foodstuffs`, `[101] ${client.config.emoji.chill} - 1x Chill Pill - removes **all** cooldowns, 6 hour cooldown for consuimg this item; consume with \`${message.guild.prefix}dose chill\`; costs :dollar: 100`)
		message.channel.send(shop);
	},
}