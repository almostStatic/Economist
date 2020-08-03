const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "search",
	aliases: ["search", "srch"],
	description: "Lets your pet go out in search of things...",
	async run(client, message, args) {
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send(`You must have a pet in order to use this command.`)
				"level;health;energy;exp;credits;intel;endur;str;affec"
		async function upgradePet() {
			let data = await client.db.get(`pet${message.author.id}`);
			data = data.split(';')
				lvl = Number(data[0])
		let p = await client.db.get("pet_name" + message.author.id) || 'pet';
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s ${p} has gotten lucky and gained :star: 2; ${p} is now level ${message.author.com == 1 ? lvl + 1 : client.comma(lvl + 1)}`)
			});
			let cred = Number(data[4]);
				if (isNaN(cred)) cred = 0;
			data[4] = Number(cred + 2);
			data[0] = lvl + 1;
			await client.db.set("pet" + message.author.id, data.join(';'))			
		}
		let cd = await client.db.get("searchc" + message.author.id);
		if (cd) return message.channel.send("You can only search once every 25 seconds!");
		await client.db.set("searchc" + message.author.id, 1, 25*1000)
		let data = await client.db.get("pet" + message.author.id)
		data = data.split(";");
		if (!data) return message.channel.send("You must own a pet in order to use this command! See `" + message.guild.prefix + "shop` for more information")
				"level;health;energy;exp;credits;intel;endur;str;affec"
		let en = Number(data[2]);
		let endur = Number(data[6]);
		let lvl = Number(data[0])
		let xp = Number(data[3])
		let intel = Number(data[5]);
		let consumed = Math.round(100 / (endur >= 4 ? endur : 3));
		const fishes = [':dolphin:',':shark:',':blowfish:',':tropical_fish:',':fish:'];		
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5);
		let oldAmt = await client.db.get(`fish${Fish}${message.author.id}`) || 0;
		oldAmt = Number(oldAmt) || 0;
		let xpGained = Math.floor( 
			Math.random() * (intel * 10)
		) * 4;
		let pn = await client.db.get(`pet_name${message.author.id}`) || "pet"
		if (endur < 4) {
			consumed = 35;
		}
		if (en - consumed < 0) {
			return message.channel.send(":yawn: I'm too tired to go searching...")
		};
		data[2] = en - consumed;
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
			.setDescription(`${message.author.tag}'s ${pn} has failed to catch ${fish} ${message.author.com == 1 ? amtGained : client.comma(amtGained)}`)
		});
		xpGained = xpGained / 2;
		} else {
		await client.db.set(`fish${Fish}${message.author.id}`, oldAmt + amtGained)
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${pn} has caught ${fish} ${amtGained} and obtained :star2: ${message.author.com == 1 ? xpGained : client.comma(xpGained)}`)
		});
		};
		data[3] = xp + xpGained;
		await client.db.set(`pet` + message.author.id, data.join(";"));
		let XP = Number(xp + xpGained)
		const amount = Math.floor(XP / 200);
		if (amount > lvl) {
			for (i=0;i<amount-lvl;i++) {
				await upgradePet();
			}
		}
	},
}