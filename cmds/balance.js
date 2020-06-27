const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'balance',
	aliases: ['balance', 'bal', 'money'],
	description: "Check someone's balance, see how much money they have",
	usage: '<User(id | @Mention)>',
	dev: false,
	guild: false,
	disabled: false,
	async run(client, message, args) {
		function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		}
		/**
		 * Displays the author's balance
		 */
			async function authorBal() {
				const authorBal = await client.db.get('bal' + message.author.id) || 0;
				message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s account contains :dollar: ${numberWithCommas(authorBal) || '0'}`)
			});			
		};
		if (!args.length) {
			return authorBal();
		};
		let usr = client.getUserFromPing(args[0]);
		if (usr) {
			usr = await client.users.fetch(usr.id, { cache: false });
		} else if (!usr) {
			try {
				usr = await client.users.fetch(args[0]);
			} catch (e) {
				return authorBal(); //user didn't give a valid user ID
			}
		} else if (usr) {
			return authorBal();
		};
		bal = await client.db.get('bal' + usr.id) || 0;
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag}'s account contains :dollar: ${numberWithCommas(bal) || '0'}`)
		})
	},
}