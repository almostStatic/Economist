const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'buy',
	aliases: ['buy', 'purchase'],
	description: "Buy something from the overpriced shop",
	category: 'ecn',
	usage: '<item>',
	dev: false,
	guild: false,
	disabled: false,
	async run(client, message, args) {
		if (isNaN(args[0])) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		let t = parseInt(args[0]);
		let T = Number(args[0]) - 1;
		if (T == 100) T = 3;
		let things = [
			{ number: 1, price: 25 },
			{ number: 2, price: 750 },
			{ number: 3, price: 250 },
			{ number: 101, price: 100 },
		];
		let valid = [1, 2, 3, 101];
			if (!t || (!valid.includes(t))) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		let bal = await client.db.get('bal' + message.author.id) || 0;
		if (!bal || (bal == 0)) return message.channel.send("You don't have enough :dollar: to purchase that item!");
		if (bal - things[T].price < 0) return message.channel.send("You don't have enough :dollar: to purchase that item!");
		if (t == 1) {
			let owns = await client.db.get('fish_rod' + message.author.id);
			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.fishing_rod}`) }
			await client.db.set('bal' + message.author.id, parseInt(bal - things[T].price));
			await client.db.set('fish_rod' + message.author.id, true);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.fishing_rod} !`)
			})
		} else if (t == 2) {
			let owns = await client.db.get('phone' + message.author.id);
			if (owns) return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.mobile_phone} !`);
			await client.db.set('bal' + message.author.id, parseInt(bal - things[T].price))
			await client.db.set('phone' + message.author.id, true);
			let phoneNumber = Math.floor(Math.random() * 100000);
			phoneNumber = Number(phoneNumber)
			while (await client.db.has("n"+phoneNumber)) {
				phoneNumber = Math.floor(Math.random() * 100000);
			}
			await client.db.set('n' + phoneNumber, message.author.id);
			await client.db.set('number' + message.author.id, phoneNumber)
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.mobile_phone} ! \`${message.guild.prefix}dial\``)
			})
		} else if (t == 3) {
			let owns = await client.db.get('phonebook' + message.author.id);
			if (owns) return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.phonebook} !`);
			await client.db.set('bal' + message.author.id, parseInt(bal - things[T].price))
			await client.db.set('phonebook' + message.author.id, true);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.phonebook} !`)
			})
		} else if (t == 101) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many pills you want to buy must be a number");
			let x = await client.db.get(`chillpills${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[T].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} chill pills!`);
			await client.db.set(`chillpills${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.chill} ${message.author.com == 1 ? amt : client.comma(amt)}!`)
			})			
		}
	},
}
