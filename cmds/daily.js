'use strict'
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'daily',
	aliases: ['daily'],
	category: 'ecn',	
	description: "Adds :dollar: 500 to your account",
	disabled: true,
	async run(client, message, args) {
		let data = await client.db.get('dailyc' + message.author.id);
		data = Number(data);
		if (!data) {
			let bal = await client.db.get('bal' + message.author.id) || 0;
			bal = Number(bal);
			await client.db.set('bal' + message.author.id, bal + 500);
			await client.db.set('dailyc' + message.author.id, message.createdTimestamp)
			message.channel.send({
				embed: new MessageEmbed()
				.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: 500 in cash`)
				.setColor(message.author.color)
			})
		} else {
//		cooldown: function (lastUsed, now, cdAmt) {
	let now = Date.now();
	let time;
	console.log(data, typeof data)
	console.log(now, typeof now)
	if (data) {
		 time = client.cooldown(
			data,
			now,//now
			86400000
		);
		console.log(time)
	};
			return message.channel.send(`You must wait another ${time.hrs} hours and ${time.mins} minutes before collecting your daily reward!`)
		};
	}
}