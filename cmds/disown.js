const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'disown',
	aliases: ['disown'],
	description: 'This **deletes** your pet. **THIS ACTION CAN NOT AND WILL NOT BE UNDONE.**', 
	async run(client, message, args) {
		const check = await client.db.get('pet' + message.author.id);
		if (!check) return message.channel.send("How are you going to disown something that you don't own?");
		let filter = m => m.author.id === message.author.id;
		const msg = await message.reply("Are you sure you want to disown your pet? **This action cannot be undone.** Reply with `y`. Anything which is not `y` will be considered as no.");
		message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] }).then(async(c) => {
			if (c.first().content.toLowerCase().startsWith("y")) {
		await client.db.delete('pet' + message.author.id);
		await client.db.delete('pet_health' + message.author.id);
		await client.db.delete('pet_affec' + message.author.id);
		await client.db.delete('pet_energy' + message.author.id);
		await client.db.delete('pet_level' + message.author.id);
		await client.db.delete("pet_xp" + message.author.id);
		await client.db.delete("pet_level" + message.author.id)
		await client.db.delete("pet_name" + message.author.id);
		await client.db.delete("pet_endurance" + message.author.id);
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has disowned their pet :sob:`)
			})
			} else message.channel.send("You didn't respond with `y`; I'll take that as a no.")
		})
			.catch((e) => {
				message.channel.send(`${message.author}, You didn't respond in time!`);
				console.log(
					e
				)
			})
	}
}