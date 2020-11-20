const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "have",
	aliases: ['have'],
	dev: true,
	description: "See the users who have a specific permission",
	category: 'btsf',
	async run (client, message, args) {
		if (!args.length) return message.channel.send("That isn't a valid permission! The different types of valid permissions are: `db`, `ner`, `civ`, `admin`, `tri`, `mod`, `reb`, `sarg`, `staff`, `cit`, `civ`, `col`, `sup`, `kw` and `mute`");
		let permission = args[0].toLowerCase();
		async function havePermission(role) {
			const roleObj = client.guilds.cache.get(client.config.supportServer).roles.cache.get(role);
			if (!roleObj) return message.channel.send("Specified role was not found.");
			var counter = 1;
			const map = roleObj.members.map(x => `${counter++}. ${x.user.tag} (${x.id})`).join('\n');
			if (map.length > 2048) {
				message.channel.send(map, { split: true });
			} else {
				message.channel.send({
					embed: new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`Users with the ${roleObj.name} Permission`)
					.setDescription(map)
				})
			}
		};
		if (permission.startsWith("db")) {
			havePermission(client.config.roles.db);
		} else if (permission.startsWith("ner")) {
			havePermission(client.config.roles.nerd);
		}  else if (permission.startsWith("civ")) {
			havePermission(client.config.roles.civilian);			
		}  else if (permission.startsWith("admin")) {
			havePermission(client.config.roles.admin);			
		} else if (permission.startsWith("tri")) {
			havePermission(client.config.roles.mod.trial);			
		} else if (permission.startsWith("mod")) {
			havePermission(client.config.roles.mod.normal);
		} else if (permission.startsWith("reb")) {
			havePermission(client.config.roles.rebel);			
		} else if (permission.startsWith("sarg")) {
			havePermission(client.config.roles.sarg);			
		} else if (permission.startsWith("staff")) {
			havePermission(client.config.roles.staff);			
		} else if (permission.startsWith("cit")) {
			havePermission(client.config.roles.cit);			
		} else if (permission.startsWith("col")) {
			havePermission(client.config.roles.col);			
		} else if (permission.startsWith("sup")) {
			havePermission(client.config.roles.supreme);			
		} else if (permission.startsWith("kw")) {
			havePermission(client.config.roles.warrior);			
		} else if (permission.startsWith("mute")) {
			havePermission(client.config.roles.muted);			
		} else if (permission.startsWith('fk')) {
		const msg = await message.channel.send(`Fetching Users...`);
		Promise.all(
				client.users.cache.map(async x => [ x, await client.db.get("fk" + x.id) ])
			).then((x) => {
				msg.edit(`Filtering Results...`)
				return x.filter(a => a[1]);
			})	
					.then((x) => {
					var counter = 1;
					msg.edit('', { embed: new MessageEmbed().setColor(message.author.color).setDescription(x.map(a => `${counter++}. ${a[0].tag} (${a[0].id})`).join('\n')).setTitle("Users with the FK Permissions:").setFooter(`In ${Date.now() - msg.createdAt} MS`) });
					})
						.catch(console.error);
		} else {
			message.channel.send("That isn't a valid permission! The different types of valid permissions are: `db`, `ner`, `civ`, `admin`, `tri`, `mod`, `reb`, `sarg`, `staff`, `cit`, `civ`, `col`, `sup`, `kw`and mute`");
		}
	},
}