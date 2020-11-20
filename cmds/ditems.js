const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ditems',
	aliases: ['dperms', 'ditems'],
	description: "Shows your currently active donor items / bought permissions",
	category: 'utl',
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		const user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = message.author;
		let data = await client.db.get("perms" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0";
		data = data.split(";");
		let ownedPerms = [];
		let perms = Object.entries(client.config.indexes);

		perms.forEach((element) => {
			//element: [ "name", index ]
			const indx = element[1]
			if (data[indx] == "1") {
				ownedPerms.push(element[0])
			} else {

			};
		});
		if (ownedPerms.length == 0) {
			ownedPerms = "You do not own anything LOL. Why not buy something? :P"
		}
		//let perms = Object.entries(client.config.roles).filter((x) => !["mod", "memberRole"].includes(x[0]));

		return message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Donor Ranks`)
			.setDescription(
				`
				Here is a list of items which are currently owned by the user. They can be bought with XP gained by chatting in our support server or by straight up paying real money to purchase them.

				\`\`\`\n${client.inspect(ownedPerms)}\n\`\`\`
				`
			)
		})
	}
}