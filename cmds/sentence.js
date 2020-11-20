const { MessageEmbed, escapeMarkdown } = require("discord.js");
const ms = require('ms');
const delay = require('delay')

module.exports = {
	name: "sentence",
	"aliases": ['sentence', 'sente'],
	judge: true,
	category: 'ecn',
	description: 'judge a user, stunning them in `range(4, 10)`',
	async run(client, message, args) {
		let coold = await client.db.get(`sentc${message.author.id}`);
		if (coold) {
			let data = client.cooldown(coold, message.createdTimestamp, ms('30m'));
			if (data) {
				return message.channel.send(`You should wait ${data.mins} minutes before imprisoning another user! Otherwise everyone would be in jail lol`)
			} else {

			}
		}
		async function dm(user, userColor, txt) {
			let embed = new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(txt)
			await client.users.cache.get(user.id)
				.send({ embed: new MessageEmbed(embed).setColor(userColor) })
					.catch((x) => {});
			message.channel.send({ embed })
			await delay(1000);
		}
		if (!args.length) return message.channel.send("You need to ping someone to sentence, dum dum")
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send("You need to ping someone to sentence, dum dum");
		await client.db.set("sentc" + message.author.id, Date.now());
		let usercolor = await client.db.get('color' + user.id) || client.config.defaultHexColor;
		let didntWork = Math.floor(Math.random() * 100);

		let bal = await client.db.get("bal" + user.id) || 0;
			bal = Number(bal);
		let amtLost = bal / 5;
		if (bal - amtLost < 0) amtLost = bal;
		amtLost = Math.floor(amtLost);

		await dm(user, usercolor, `${message.author.tag} has summoned ${user.tag} in court`);
		await dm(user, usercolor, `It turns out ${user.tag} is a loser and ends up pissing on the floor, losing their dignity :joy:`);
		if (didntWork > 90) {
			await dm(user, usercolor, `${user.tag}'s lawyer was able to save ${user.tag}'s ass this time round!`)
			await dm(user, usercolor, `:skull_crossbones: ${message.author.tag} failed to sentence ${user.tag}`);
			return;
		} else {
		let stunTime = Math.floor(Math.random() * 10);
		if (stunTime < 4) stunTime = 4;
		stunTime *= ms('1m');
		await client.db.set("stun" + user.id, `${message.createdTimestamp};${stunTime}`);
		await client.db.set('stunmsg' + user.id, "You can't use any commands while you're in jail! ($time)");
		await dm(user, usercolor, `After careful consideration, it is decided that ${user.tag} is punishable as a result of their insane ugliness; ${message.author.tag} has won the court case`)
		await dm(user, usercolor, `:dollar: ${message.author.com == 1 ? amtLost : client.comma(amtLost)} have been moved to ${message.author.tag}'s account since ${user.tag} was unable to win the court case lol`)
		await client.db.set("bal" + user.id, bal - amtLost)
		let oldBal = await client.db.get("bal" + message.author.id) || 0;
			oldBal = Number(oldBal);
		let newBal = (oldBal + amtLost);
		await client.db.set('bal' + message.author.id, newBal);
		await dm(user, usercolor, `${user.tag} has been put into jail for ${stunTime / ms('1m')} minutes`);
		};
	}
}