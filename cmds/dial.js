const { MessageEmbed } = require('discord.js');
const delay = require('delay');
const ms = require('ms')
module.exports = {
	name: 'dial',
	aliases: ['dial', 'text'],
	description: "Sends a direct message to the user who's phone number you have included. Requires a phone with a 10 minute cooldown",
	category: 'phn',	
	async run(client, message, args) {
		let lastUsed = await client.db.get('dialc' + message.author.id);
		let cd = 600000;
		if (lastUsed) {
				const now = Date.now();
				let expirationTime = Number(lastUsed) + cd;
				if (now < expirationTime) {
					let cd = Math.round((expirationTime - now) / ms('1m'));
					return message.channel.send(`You must wait another ${cd} minutes before texting another user!`)
				}
		};
		if (isNaN(args[0])) return message.channel.send(`${client.config.emoji.err} You must provide a valid phone number!`)
		let number = await client.db.get(`n` + args[0]);
		if (!number) return message.channel.send(`${client.config.emoji.err} An incorrect phone number was provided.`);
		let usr = await client.users.fetch(number);		
		let oldc = await client.db.get(`dialcount${number}`) || 0;
		await client.db.set('dialcount' + number, parseInt(oldc + 1));
		let success = true;
		let blok = await client.db.get(`isBlocked${message.author.id}${usr.id}`);
		if(blok) return message.channel.send(`${client.config.emoji.err} You have been blocked from dialing that number!`)
		client.users.cache.get(number)
			.send({
				embed: new MessageEmbed()
				.setTitle(`${message.author.tag} has sent you a text!`)
				.setDescription(args.slice(1).join(' '))
				.setColor(await client.db.get('color' + usr.id) || client.config.defaultHexColor)
			}).catch((err) => {
				return message.channel.send(`${client.config.emoji.err} That user has their DMs locked`);
				success = false;
			});
			if (success == true) {
				client.users.cache.get(number).send(
					`:warning: You can prevent ${message.author.tag} from texting you again by using \`~block ${message.author.id}\` in any server`
				).catch((x) => {});
				await client.db.set('dialc' + message.author.id, Date.now(), ms('10m'));
				const msg = await message.channel.send({ embed: new MessageEmbed().setDescription(`Fetching phone number...`) });
				await delay(1000);
				msg.edit({
					embed: new MessageEmbed().setDescription(`${message.author.tag} has dialed ${args[0]} on their ${client.config.emoji.mobile_phone} and sent ${usr.tag} a text!`).setColor(message.author.color)
				})
			};
	},
}