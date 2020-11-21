const { MessageEmbed } = require('discord.js');
const delay = require('delay');

module.exports = {
	name: 'cast',
	aliases: ['cast', 'fish'],
	description: 'Allows you to go fishing!\nCosts :dollar: 50',
	category: 'ecn',
	async run(client, message, args) {
		const fish_rod = await client.db.get('fish_rod' + message.author.id);
		if (!fish_rod) return message.channel.send(`You need a ${client.config.emoji.fishing_rod} in order to go fishing! \`${message.guild.prefix}shop\``);
		const cooldown = await client.cdb.get('fishc' + message.author.id);
		if (cooldown) return message.channel.send("You can only fish once every 20 seconds, otherwise your fishing rod will break!");
		const fishes = [
			':dolphin:',
			':shark:',
			':blowfish:',
			':tropical_fish:',
			':fish:',
		];
		const bal = await client.db.get('bal' + message.author.id) || 0;
		await client.cdb.set('fishc' + message.author.id, Date.now(), 12000);
		message.channel.send({ embed: new MessageEmbed().setDescription(`${message.author.tag} locates their ${client.config.emoji.fishing_rod} and goes fishing...`).setColor(message.author.color) })
		await delay(2000);
		const Fish = Math.floor(Math.random() * fishes.length)
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5)
		let dollarsEarned = Math.round(amtGained / 5) * 10;
		let oldAmt = await client.db.get(`fish${Fish}${message.author.id}`) || 0;
		oldAmt = Number(oldAmt) || 0;
		await client.db.set(`fish${Fish}${message.author.id}`, oldAmt + amtGained)
		if (fishes[fish] == ':dolphin:') dollarsEarned = (dollarsEarned * 2) * amtGained;
		if (fishes[fish] == ':shark:') dollarsEarned = (dollarsEarned / 2) * amtGained;
		if (fishes[fish] == ':blowfish:') dollarsEarned = 0;
		if (fishes[fish] == ':tropical_fish:') dollarsEarned = (dollarsEarned * 3) * amtGained;
		if (fishes[fish] == ':fish:') dollarsEarned = 10 * amtGained;
		message.channel.send({ embed: new MessageEmbed().setDescription(`${message.author.tag} sits down near a calm pool of water... :droplet:`).setColor(message.author.color) })
		await delay(2000);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has found a school of ${fish}...`)
		});
		await delay(2000)
		if (fishes[fish] != ':blowfish:') {
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has caught ${fish} ${amtGained} and earnt :dollar: ${dollarsEarned}`)
			})
			await client.db.set(`bal${message.author.id}`, parseInt(bal + dollarsEarned));
		} else {
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Due to the blowfish having spikes, ${message.author.tag} is unable to catch enough of them and ends up wasting their time :(`)
			})
		}
	},
}