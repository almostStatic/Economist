const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'stroke',
	aliases: ['stroke', 'str'],
	description: "Stroke your pet and increase its Affection by 1",
	category: 'pet',
	async run(client, message, args) {
		let cooldown = await client.cdb.get('strokec' + message.author.id);
		let time = ms('30m');
		if (cooldown) {
				const now = Date.now();
				let expirationTime = parseInt(cooldown) + time;
				if (now < expirationTime) {
					let cd = Math.round((expirationTime - now) / ms('1m'));
					return message.channel.send(`You must wait another ${cd} minutes before stroking your pet again!`)
				}
		};
		let pet = await client.db.get("pet"+message.author.id);
		if (!pet)	return message.channel.send("It looks like you don't own a pet! Why not adopt one by using `" + message.guild.prefix + "adopt`")	
			pet = pet.split(';');
"level;health;energy;exp;credits;intel;endur;str;affec"
		let affec = Number(pet[8]);
		if(affec > 1000) return message.channel.send("Your pet's affection points may not exceed 1000");
		affec = affec + 1;
		pet[8] = affec.toString();
		let petn = await client.db.get(`petname${message.author.id}`) || "pet";
		await client.db.set(`pet${message.author.id}`, pet.join(';'));
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`:sparkling_heart: ${message.author.tag} has stroked their ${petn}; ${petn}'s affection towards ${message.author.tag} has increaed by one. awe`)
		});
		await client.cdb.set(`strokec${message.author.id}`, Date.now(), ms('30m'));
	}
}