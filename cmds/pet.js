const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'pet',
	aliases: ['pet', 'p'],
	category: 'pet',
	description: "View your pet's stats",
	async run(client, message, args) {
		async function Embed(id, tag, bot = false) {
			let data = await client.db.get('pet' + id, { raw: false });
			if (bot == true) {
				data = "9999999999;9999999999999999999999999999999999999999;9999999999999999999999999999999999999999;9999999999999999999999999999999999999999;9999999999999999999999999999999999999999;9999999999999999999999999999999999999999;9999999999;9999999999999999999999999999999999999999;9999999999999999999999999999999999999999";
			};
			if(!data) {
				return message.channel.send(`${message.author.id == id ? `You don't own a pet!` : `${tag} does not own a pet!`} Why not adopt one by using \`${message.guild.prefix}adopt\``)
			};
			data = data.split(";");
			"level;health;energy;exp;credits;intel;endur;str;affec"
			let name = await client.db.get('petname' + id);
			let health = data[1];
			let affec = data[8];
			let energy = data[2];                                         
			let level = data[0];
			let xp = data[3];
			let cred = data[4];
			let intel = data[5];
			let endur = data[6];
			let str = data[7];
			if (name) { isNamed = 'Y' } else { isNamed = 'N' };
			let nextLevel = new Number(level * 200)
			let emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${tag}'s Pet ${isNamed == 'Y' ? `(${name})` : ''} [${level}]`)
				.setDescription(`\`${message.guild.prefix}disown\` to disown your pet and delete it\n\`${message.guild.prefix}feed\` to feed your pet and completely re-fill its energy\n\`${message.guild.prefix}name <new name>\` to name your pet (requires Supreme)\n\`${message.guild.prefix}stroke\` to stroke your pet and increase its Affection by 1\n\`${message.guild.prefix}search\` to get your pet to go out searching for stuffs and gain a certain amount of XP depending on your pet's Intellect\n\`${message.guild.prefix}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1
				\`${message.guild.prefix}downgrade <stat>\` - downgrade a stat by 1 point and receive 1 :star: in return 
				\`${message.guild.prefix}deprive <stat>\` - Completely remove all invested :star: on the stat and receive the appropriate amount of credits in return. For example, say a user has 5 total points on strength: \`${message.guild.prefix}deprive strength\` would set the strength stat to 1 and return 4 credits
				`)
				.addField(
					`Stats`,
`
:heart: Health - ${health}/10000
:zap: Energy - ${energy}

:star2: Experience - ${message.author.com == 1 ? xp : client.comma(xp)}/${message.author.com == 1 ? nextLevel : client.comma(nextLevel)}
:star: Credits - ${message.author.com == 1 ? cred : client.comma(cred)}

:bulb: Intellect - ${intel}
:field_hockey: Endurance - ${endur}
:fire: Strength - ${str}
:sparkling_heart: Affection - ${affec}
`
, true
				)
			return message.channel.send({ embed: emb })
		}
		if (!args.length) {
			return Embed(message.author.id, message.author.tag)
		};
		if(!args.length) args = [message.author.id];
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		 Embed(usr.id, usr.tag, usr.bot);
	},
}