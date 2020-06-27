const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "search",
	aliases: ["search", "srch"],
	description: "Lets your pet go out in search of things...",
	async run(client, message, args) {
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send(`You must have a pet in order to use this command.`)
		async function upgradePet() {
			let cred = await client.db.get(`pet_credits${message.author.id}`) || 0;
				if (isNaN(cred)) cred = 0;
			let newCred = Number(cred + 2);
			let lvl = await client.db.get(`pet_level${message.author.id}`) || 1;
				lvl = Number(lvl) + 1;
			let p = await client.db.get("pet_name" + message.author.id) || 'pet';
			await client.db.set(`pet_credits${message.author.id}`, newCred);
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s ${p} has gotten lucky and gained :star: 2; ${p} is now level ${lvl}`)
			});
			await client.db.set(`pet_level${message.author.id}`, lvl);
		}
		let en = await client.db.get("pet_energy" + message.author.id);
		if (!en) {
			en = 0;
		}
		en = Number(en);
		let endur = await client.db.get("pet_endurance" + message.author.id) || 1;
		let lvl = await client.db.get("pet_level" + message.author.id) || 1;
		let xp = await client.db.get(`pet_xp` + message.author.id) || 0;
		let intel = await client.db.get("pet_intel" + message.author.id) || 1;
		let consumed = Math.round(100 / (endur >= 4 ? endur : 3));
		const fishes = [':dolphin:',':shark:',':blowfish:',':tropical_fish:',':fish:'];		
		const fish = fishes[Math.floor(Math.random() * fishes.length)];
		const amtGained = Math.floor(Math.random() * 250 / 5);
		let oldAmt = await client.db.get(`${fish}${message.author.id}`) || 0;
		oldAmt = parseInt(oldAmt) || 0;
		let xpGained = Math.floor( 
			Math.random() * (intel ^ 50) / 2
		) * 2;
		let pn = await client.db.get(`pet_name${message.author.id}`) || "pet"
		if (endur < 4) {
			consumed = 35;
		}
		if (en - consumed < 0) {
			return message.channel.send("I'm too tired to go searching :-(")
		};
		await client.db.set(`pet_energy${message.author.id}`, Number(en - consumed))
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has gone in search of stuffs and consumed :zap: ${Number(consumed)}`)
		})
		await delay(1500)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has settled down near a calm lake`)
		})		
		await delay(1500)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has found ${fish} ${amtGained}`)
		});
		await delay(1500)
		var Num = Math.floor(Math.random());
		if(Num > 60) {
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has failed to catch ${fish} ${amtGained}`)
		});
		xpGained = xpGained / 2;
		} else {
		await client.db.set(`${fish}${message.author.id}`, oldAmt + amtGained)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has caught ${fish} ${amtGained} and obtained :star2: ${xpGained}`)
		});
		};
		await client.db.set(`pet_xp` + message.author.id, parseInt(xp + xpGained));
		let XP = Number(xp + xpGained)
		console.log(xp, typeof xp)
		message.channel.send(`lvl=${require("util").inspect(lvl, { depth: 0 })}\nxp=${require("util").inspect(xp, { depth: 0 })}\ntotal_xp=${require("util").inspect(XP, { depth: 0 })}`, { code: 'js' })
		if (XP > 100 && (Number(lvl) == 1)) {
			await upgradePet()
				.catch(console.error);
		} else if (XP > 250 && (Number(lvl) == 2)) {
			await upgradePet()
		} else if (XP > 400 && (Number(lvl) == 2)) {
			await upgradePet()
		}else if (XP > 550 && (Number(lvl) == 2)) {
			await upgradePet()
		}
	},
}