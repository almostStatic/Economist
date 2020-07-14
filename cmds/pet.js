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
			data = data.split(";");
			"level;health;energy;exp;credits;intel;endur;str;affec"
			let name = await client.db.get('pet_name' + id);
			let health = data[1];
			let affec = data[8];
			let energy = data[2];
			let level = data[0];
			let xp = data[3];
			let cred = data[4];
			let intel = data[5];
			let endur = data[6];
			let str = data[7]
			if (name) { isNamed = 'Y' } else { isNamed = 'N' };
			let nextLevel = new Number(level * 200)
			let emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${tag}'s Pet ${isNamed == 'Y' ? `(${name})` : ''} [${level}]`)
				.setDescription(`\`${message.guild.prefix}disown\` to disown your pet and delete it\n\`${message.guild.prefix}name <new name>\` to name your pet\n\`${message.guild.prefix}stroke\` to stroke your pet and increase its Affection by 1\n\`${message.guild.prefix}search\` to get your pet to go out searching for stuffs and gain a certain amount of XP depending on your pet's Intellect\n\`${message.guild.prefix}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1`)
				.addField(
					`Stats`,
`
:heart: Health - ${client.comma(health)}/10,000
:zap: Energy - ${energy || 0}

:star2: Experience - ${client.comma(xp)}/${client.comma(nextLevel)}
:star: Credits - ${cred}

:bulb: Intellect - ${client.comma(intel)}
:field_hockey: Endurance - ${client.comma(endur)}
:fire: Strength - ${client.comma(str)}
:sparkling_heart: Affection - ${client.comma(affec)}
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