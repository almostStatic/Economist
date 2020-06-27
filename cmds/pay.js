const { MessageEmbed } = require('discord.js');
require('keyv');

module.exports = {
	name: 'pay',
	aliases: ['pay'],
	description: 'Pay someone else :dollar:\n\nTo pay someone your entire balance, use `all`',
	usage: 'pay <user> <amount>',
	dev: false,
	guild: false,
	col: false,
	disabled: false,
	async run(client, message, args) {
		/**
		 * Tells the `user` they don't have enough money t pay someone else.
		 */
		function notEnough() {
			return message.channel.send("You don't have enough :dollar: in your bank!")
		}
		const authorBal = await client.db.get('bal' + message.author.id);
		if (!args.length) return message.channel.send("You must tell me who to transfer money to!");
			let usr;
				try {
					usr = await client.users.fetch(client.getID(args[0]))
				} catch (err) {
					usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('invalid user '))
				};
			if (!usr) return message.channel.send("Whoops! I can't find that user");
			if (message.author.id == usr.id) return mesage.channel.send(`You can't pay yourself!`);
			if (!args[1]) return message.channel.send("You must specify the amount of :dollar: you wish to pay " + usr.username);
		let amt = args[1].toLowerCase();
		if (amt.startsWith('all')) amt = authorBal;
		amt = parseInt(amt);
		console.log(amt, typeof Number(amt)) // => 10, Number
		if (isNaN(amt) && (!amt.startsWith('all'))) return message.channel.send("You must provide a valid number! (or just `all`)")
		if (authorBal < 0 || (!authorBal) || (parseInt(authorBal - amt) < 0)) return notEnough();
		const amountLeft = Number(Number(authorBal) - Number(amt));
		if (amountLeft < 0) return notEnough();
		 await client.db.set('bal' + message.author.id, amountLeft);
		let oldBal = await client.db.get('bal' + usr.id);
		if (!oldBal) oldBal = 0;
		console.log(oldBal, typeof oldBal)
		const newBal = Number(oldBal + amt);
//		client.economy.add('bal' + usr.id, newBal)
	//	const newBal =  Number(Number(oldBal) + Number(amt)).toPrecision()
		console.log(newBal, typeof newBal)
		await client.db.set('bal' + usr.id, newBal.toString())
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has paid :dollar: ${client.comma(amt)} (${amt.toString().length} digits) into ${usr.tag}'s account`)
		})
	},
}