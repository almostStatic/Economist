const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'data',
	aliases: ['getdata', 'data', 'store', 'gd'],
	category: 'utl',	
	description: "View a User's stored data",
	async run(client, message, args) {
		/**
		 * This function will show all stored data regarding a User.
		 * @param {object} user Target user whose data must be shown 
		 */
		async function data(user = message.author) {
			const msg = await message.channel.send(`Fetching **${user.tag}**'s Data...`);
			let Keys = client.keys.concat(["user"]).concat(client.commands.map(x => "cmds." + x.name));

			var shown = [];
			Promise.all(
				Keys.map(async(x) => {
					if (shown.includes(x)) {
						return false;
					};
					shown.push(x);
					if (x == "user") return `user=${user.tag};${user.id}`;
					const value = await client.db.get(`${x}${user.id}`);
					if (value) {
						if (typeof value == "object") {
							const data = Object.entries(value).map((x) => {
								if (typeof x[1] == "object") {
									return "[this.key=" + x[0] + ";" + Object.entries(x[1]).map((z) => z.join(";")).join(";") + "]"
								} else {
									return x.join(";");
								}
							}).join(";");
							return `${x}=${data || "{}"}\n${x}.type=Object`;
						}
						return `${x}=${value}`;
					} else {
						return false;
					};
				})
			)
				.then((f) => f.filter(a => a != false))
					.then((data) => {
						const returned = data
							.join("\n");
						msg.edit(`${client.config.emoji.tick} Successfully fetched ${user.tag}'s data; it will be sent shortly.`);
						return message.channel.send(data, { code: "", split: true })
					})
		};
		const perms = await client.db.get('perms' + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
		pms = perms.split(';');
		if (pms[8] != '1') {
			return data();
		} else {
			if (!args.length) args = [message.author.id];
			let user = await client.usr(args[0]).catch((x) => {});
			if (!user) {
				user = message.author;
			};
			data(user);
		};
	},
};
