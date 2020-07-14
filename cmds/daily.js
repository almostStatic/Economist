'use strict'
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'daily',
	aliases: ['daily'],
	description: "Adds :dollar: 500 to your account",
	async run(client, message, args) {
		let data = await client.db.get('dailyc' + message.author.id);
		if (!data) {
			let bal = await client.db.get('bal' + message.author.id);
			if (!bal) bal = 0;
			bal = Number(bal);
			await client.db.set('bal' + message.author.id, bal + 500);
			await client.db.set('dailyc' + message.author.id, {
				lastUsed: Date.now(),
				cd: 864000000
			}, 864000000)
			message.channel.send({
				embed: new MessageEmbed()
				.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: 500 in cash`)
				.setColor(message.author.color)
			})
		} else {
			let now = Date.now();
			let time = client.cooldown(
				data.lastUsed,
				now,
				data.cd,
			)//		cooldown: function (lastUsed, now, cdAmt) {
			return message.channel.send(`You must wait another ${time.hrs} hours and ${time.mins} minutes before collecting your daily reward!`)
		};
	}
}