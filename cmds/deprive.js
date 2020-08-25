const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'deprive',
	aliases: ['deprive'],
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	sup: true,
	async run(client, message, args) {
			"level;health;energy;exp;credits;intel;endur;str;affec"
		let cd = await client.db.get("dprvc" + message.author.id);
		if (cd) {
			let data = require('../config.js').functions.cooldown(cd, message.createdTimestamp, require('ms')('2h'));
			if (data) {
				return message.channel.send("You should like wait " + data.hrs + " hours and " + data.mins + " minutes before depriving another stat!");
			} else {

			};
		};
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send("You don't seem to own a pet!");
		if(!args.length) return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`")
		let petName = await client.db.get("pet_name" + message.author.id) || 'pet'
		let stat = args[0].toLowerCase();
		let Stat;
		let index;
			if (stat.startsWith("int")) {
				Stat = "intellect";
				index = 5;
			} else if (stat.startsWith("end")) {
				Stat = "endurance";
				index = 6;
			} else if (stat.startsWith("str")) {
				Stat = "strength";
				index = 7;
			} else {
				return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`")
			};
		pet = pet.split(';');
		let Credits = Number(pet[index]);
		let amt = Credits - 1;
		if (amt < 0) {
			return message.channel.send("You must have at least 2 credits on a specified `<stat>` before depriving your pet of this stat.");
		};
		await client.db.set('dprvc' + message.author.id, Date.now());
		pet[index] = Credits - amt;
		pet[4] = Number(pet[4]) + amt;
		await client.db.set('pet' + message.author.id, pet.join(';'));
		message.channel.send({
			embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has deprived ${petName}'s ${Stat} by ${amt} points and received ${amt} credits!`)
		})
	},
};