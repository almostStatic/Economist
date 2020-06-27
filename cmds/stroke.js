const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'stroke',
	aliases: ['stroke', 'str'],
	description: "Stroke your pet and increase its Affection by 1",
	async run(client, message, args) {
		let cooldown = await client.db.get('strokec' + message.author.id);
		let time = ms('30m');
		if (cooldown) {
				const now = Date.now();
				let expirationTime = parseInt(cooldown) + time;
				if (now < expirationTime) {
					let cd = Math.round((expirationTime - now) / ms('1m'));
					return message.channel.send(`You must wait another ${cd} minutes before stroking your pet again!`)
				}
		};
		let x = await client.db.get("pet"+message.author.id);
		if (!x)	return message.channel.send("It looks like you don't own a pet! Why not adopt one by using `" + message.guild.prefix + "adopt`")	
		let affec = await client.db.get("pet_affec" + message.author.id) || 0;
		if(affec > 1000) return message.channel.send("Your pet's affection points may not exceed 1,000")
		affec = Number(affec);
		let pet = await client.db.get(`pet_name${message.author.id}`) || "pet";
		await client.db.set(`pet_affec${message.author.id}`, affec+1);
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`:sparkling_heart: ${message.author.tag} has stroked their ${pet}; ${pet}'s affection towards ${message.author.tag} has increaed by one. awe`)
		});
		await client.db.set(`strokec${message.author.id}`, Date.now());
	}
}