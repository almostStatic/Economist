const { MessageEmbed } = require('discord.js');
const ms = require('ms')

module.exports = {
	name: 'cooldowns',
	aliases: ['cds', 'cooldowns', 'cd', 'coold'],
	supreme: true,
	category: 'utl',	
	sup: true,
	async run(client, message, args) {
		 async function getCd(key, cdAmt) {
			 let lastUsed = await client.db.get(key);
				if (lastUsed) {
					let cooldownData = client.cooldown(lastUsed, message.createdTimestamp, cdAmt);
					if (cooldownData) {
						return { hrs: cooldownData.hrs, mins: cooldownData.mins };
					} else {
						return null;
					}
				} else {
					return null;
				}
		}
		async function cds(id, tag) {
			let cooldown = ``;
			const dailyc = await getCd(`dailyc${id}`, 86400000);
			if (dailyc) {
				cooldown = `${cooldown}\ndaily: ${dailyc.hrs} hrs, ${dailyc.mins} mins`
			};

			const judgec = await getCd("sentc" + id, ms('30m'));
			if (judgec) {
				cooldown = `${cooldown}\nsentence: ${judgec.hrs} hrs, ${judgec.mins} mins`
			};		

			const dialc = await getCd("dialc" + id, ms('10m'));
			if (dialc) {
				cooldown = `${cooldown}\ndial: ${dialc.hrs} hrs, ${dialc.mins} mins`;
			};				

			const chillc = await getCd("chillc" + id, ms('6h'));
			if (chillc) {
				cooldown = `${cooldown}\ndose chillpill: ${chillc.hrs} hrs, ${chillc.mins} mins`
			};	

			const strc = await getCd("strokec" + id, ms('30m'));
			if (strc) {
				cooldown = `${cooldown}\nstroke: ${strc.hrs} hrs, ${strc.mins} mins`
			};	

			const robc = await getCD("robc" + id, ms("20m"))
			if (robc) {
				cooldown = `${cooldown}\nrob: ${robc.hrs} hrs, ${robc.mins} mins`
			};	

			message.channel.send({
				embed: new MessageEmbed()
				.setTimestamp()
				.setColor(message.author.color)
				.setTitle(`${tag}'s Cooldowns`)
				.setDescription(
					`
					${cooldown ? cooldown : "`[NO ACTIVE COOLDOWNS]`"}
					`
				)
			})
		}
		const mem = client.guilds.cache.get(client.config.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.roles.staff);
		if (!mem || (mem != true)) {
			return cds(message.author.id, message.author.tag);
		} else {
			if (!args.length) args = [message.author.id];
			const user = await client.usr(args[0]);
			cds(user.id || message.author.id, user.tag)
		}
	}
}