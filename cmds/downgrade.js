const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'downgrade',
	aliases: ['downgrade', 'decondition'],
	description: `downgrade one of your pet's stat and receive one credit in return`,
	category: 'pet',
	async run(client, message, args) {
		const cd = await client.db.get('dwngrdc' + message.author['id']);
		if (cd) {
			//lastused, now, cdamt
			const data = client.cooldown(cd, message.createdTimestamp, ms('2h'));
			if (data) {
				return message.channel.send(`You must wait another ${data.hrs} hours and ${data.mins} before downgrading another one of your pet's stat!`);
			} else {
				await client.db.set('dwngrdc' + message.author.id, Date.now());
			};
		} else {
			let data = await client.db.get("pet" + message.author.id);
			if (!data) return message.channel.send("You don't have a pet!\n`" + message.guild.prefix + "adopt` to adopt one!");
			var disallow = false; 
			data = data.split(';');
			if(!args.length) return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`");
			let stat = args[0].toLowerCase();
			let Stat;
				if (stat.startsWith("int")) {
					Stat = "intellect";
				} else if (stat.startsWith("end")) {
					Stat = "endurance";
				} else if (stat.startsWith("str")) {
					Stat = "strength";
				} else {
					return message.channel.send("The different types of stats are: `intellect`, `endurance` and `strength`")
				};
			let name = await client.db.get("petname" + message.author.id) || 'their pet';
			"level;health;energy;exp;credits;intel;endur;str;affec";
			data[4] = Number(data[4]);
			data[4] = data[4] + 1;
			if (Stat == "intellect") {
				data[5] = Number(data[5]);
				data[5] = data[5] - 1;
				if (data[5] < 1) disallow = true;
			} else if (Stat == "endurance") {
				data[6] = Number(data[6]);
				data[6] = data[6] - 1;		
				if (data[6] < 1) disallow = true;
			} else if (Stat == 'strength') {
				data[7] = Number(data[7]);
				data[7] = data[7] - 1;
				if (data[7] < 1) disallow = true;
			};
			if (disallow) return message.channel.send("Your pet's stat must have at **least** one credit");
			await client.db.set("pet" + message.author.id, data.join(';'));
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has downgraded ${name}'s ${Stat} by 1 point and received :star: 1!`)
			}).catch((x) => {});
			await client.db.set("dwngrdc" + message.author.id, Date.now());
		};
	},
};