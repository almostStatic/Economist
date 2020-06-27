const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'pet',
	aliases: ['pet', 'p'],
	description: "View your pet's stats",
	async run(client, message, args) {
		async function Embed(id, tag) {
			let data = await client.db.get('pet' + id);
			if(!data) {
				return message.channel.send("It looks like you don't own a pet! Why not adopt one by using `" + message.guild.prefix + 'adopt`')
			};
			let name = await client.db.get('pet_name' + id);
			let health = await client.db.get('pet_health' + id) || 10000;
			let affec = await client.db.get('pet_affec' + id) || 0;
			let energy = await client.db.get('pet_energy' + id);
			let level = await client.db.get('pet_level' + id)
			let xp = await client.db.get("pet_xp" + id) || 0;
			let cred = await client.db.get("pet_credits" + id) || 0;
			let intel = await client.db.get("pet_intel" + id) || 1;
			let endur = await client.db.get('pet_endurance' + id) || 1;
			if (name) { isNamed = 'Y' } else { isNamed = 'N' };

			let xpUntilLevelUp;
				if (level == "1") {
					xpUntilLevelUp = 100
				} else if (level == "2") {
					xpUntilLevelUp = 200;
				}else if (level == "3") {
					xpUntilLevelUp = 350;
				} else if (level == "4") {
					xpUntilLevelUp = 500;
				}else if (level == "5") {
					xpUntilLevelUp = 650;
				}else if (level == "6") {
					xpUntilLevelUp = 800;
				}else if (level == "7") {
					xpUntilLevelUp = 950;
				}else if (level == "8") {
					xpUntilLevelUp = 1100;
				}else if (level == "9") {
					xpUntilLevelUp = 1250;
				}else if (level == "10") {
					xpUntilLevelUp = 1500;
				} else xpUntilLevelUp = "100000000000000000000000000000000";
				message.channel.send(`level=${require("util").inspect(level, { depth: 0 })}\nxp=${require("util").inspect(xp, { depth: 0 })}`, { code: 'js' })
			let emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${tag}'s Pet ${isNamed == 'Y' ? `(${name})` : ''} [${level}]`)
				.setDescription(`\`${message.guild.prefix}disown\` to disown your pet and delete it\n\`${message.guild.prefix}name <new name>\` to name your pet\n\`${message.guild.prefix}stroke\` to stroke your pet and increase its Affection by 1\n\`${message.guild.prefix}search\` to get your pet to go out searching for stuffs and gain a certain amount of XP depending on your pet's Intellect`)
				.addField(
					`Stats`,
`
:heart: Health - ${client.comma(health)}/10,000
:zap: Energy - ${energy || 0}

:star2: Experience - ${xp}/${xpUntilLevelUp}
:star: Credits - ${cred}

:bulb: Intellect - ${intel}
:field_hockey: Endurance - ${endur}
:sweat_smile: Excitment - <null>
:sparkling_heart: Affection - ${affec}
`
, true
				)

			return message.channel.send({ embed: emb })
		}
		if (!args.length) {
			return Embed(message.author.id, message.author.tag)
		};
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('I can\'t find user "' + args[0] + '"'))
		};
		 Embed(usr.id, usr.tag);
	},
}