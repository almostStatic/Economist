const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'upgrade',
	aliases: ['upgrade', 'improve'],
	description: `Upgrade one of your pet's stat`,
	async run(client, message, args) {
		let data = await client.db.get("pet" + message.author.id);
		if (!data) return message.channel.send("You don't have a pet!\n`" + message.guild.prefix + "adopt` to adopt one!")
		data = data.split(';');
		if(!args.length) return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`")
		let stat = args[0].toLowerCase();
		let Stat;
			if (stat.startsWith("int")) {
				Stat = "intellect"
			} else if (stat.startsWith("end")) {
				Stat = "endurance"
			} else if (stat.startsWith("str")) {
				Stat = "strength"
			} else {
				return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`")
			}
		let amt = isNaN(args[1]) ? 1 : Number(args[1]);
		let name = await client.db.get("pet_name" + message.author.id) || 'their pet';
		        "level;health;energy;exp;credits;intel;endur;str;affec"
		let credits = Number(data[4]);
		if (credits - amt < 0) return message.channel.send("You don't have enough credits for that!");
		data[4] = credits - amt; 
		if (Stat == "intellect") {
			let old = Number(data[5]);
			data[5] = old + amt;					
		} else if (Stat == "endurance") {
			let old = Number(data[6]);
			data[6] = old + amt;			
		} else if (Stat == 'strength') {
			let old = Number(data[7]);
			data[7] = old + amt;			
		};
		await client.db.set("pet" + message.author.id, data.join(';'))
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has upgraded ${name}'s ${Stat} by ${amt} points!`)
		});
	}
}