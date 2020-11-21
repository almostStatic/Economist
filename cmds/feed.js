const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'feed',
	aliases: ['f', 'fuel', 'feed'],
	description: "Feed your pet and increase its energy.",
	category: 'pet',
	async run(client, message, args) {
		let cooldown = await client.db.get('feedc' + message.author.id);
		let time = ms('20m');
		if (cooldown) {
			const data = client.cooldown(cooldown, message.createdTimestamp, time);
			if (data) {
				return message.channel.send(`You must wait another ${data.mins} minutes before feeding your pet again or else it'll be as fat as you`);
			};
		} else {
			await client.db.set(`feedc${message.author.id}`, Date.now());
		}
		let pet = await client.db.get("pet"+message.author.id);
		if (!pet)       return message.channel.send("It looks like you don't own a pet! Why not adopt one by using `" + message.guild.prefix + "adopt`")        
						pet = pet.split(';');
"level;health;energy;exp;credits;intel;endur;str;affec"
		let energy = Number(pet[2]);
		if (energy > 99) return message.channel.send("Your pet's energy may not exceed 100!");
		mathEner = 100 - energy 
		affec = 100;
		pet[2] = affec.toString();
		let petn = await client.db.get(`petname${message.author.id}`) || "pet";
		await client.db.set(`pet${message.author.id}`, pet.join(';'));
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has fed their ${petn}, replenishing :zap: ${mathEner}!`)
		});
		await client.cdb.set(`feedc${message.author.id}`, Date.now(), ms('20m'));
	}
}