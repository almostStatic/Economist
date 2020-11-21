const Discord = require('discord.js');

module.exports = {
	name: 'take',
	aliases: ['take', "remove"],
	description: 'removes permissions to users.',
	dev: true,
	category: 'btsf',
	guild: true,
	async run(client, message, args) {
		const help = new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setTitle('Permissions')
			.setTimestamp()
			.addField('Note', 'Upon receiving these permissions, users will gain a role in the support server.\nThe user you wish to add permissions to must be a member of the support server')
			.setDescription(
				`**__Staff__** (matches "staff"):
			  - Access to \`${message.guild.prefix}assign <permission> <user>\`
				- Access to \`${message.guild.prefix}get <key>\`
				- Access to \`${message.guild.prefix}have <permission>\`
				- Access to \`${message.guild.prefix}cmd <user> <command>\`
				- Access to \`${message.guild.prefix}stun <user> <time>\`
				- Access to \`${message.guild.prefix}unstun <user>\`
				- Access to \`${message.guild.prefix}approve <id>\`
				- Access to \`${message.guild.prefix}reject <id>\`
				- Access to \`${message.guild.prefix}cantuse <command>\`
				- Access to \`${message.guild.prefix}spawn\`
			  - Access to \`${message.guild.prefix}change-prefix <guild id> <new prefix>\`

				**__Businessman__** (matches "busn")
				- Access to \`${message.guild.prefix}business\`

				**__Database Manager__** (matches "db"):
				- Access to \`${message.guild.prefix}set <key> <value>\` 
				- Access to \`${message.guild.prefix}delete <key>\`				  

			**__Colorist__** (matches "col"):
			  - Access to \`${message.guild.prefix}color <new color>\` 	

			**__Moderator__** (matches "mod"):
			  - Access to moderator commands (warn, kick, ban, etc)

			**__Keyboard Warrior__** (matches "kw"): 
			  - Access to \`${message.guild.prefix}snipe\`

			**__Rebel__** (matches "reb"):
			  - Clears 3 second cooldown 

			**__Sargent__** (matches "sarg"): 
			  - <nothing yet>			

			**__Nerddd__** (matches "ner"):
			  - Access to bot logs

			**__Supreme__** (matches "sup"):
			  - Access to \`${message.guild.prefix}name <name>\`

			**__Civilian__** (matches "civ"):
			  - Access to send messages in <#706931623479738490> 

			**__Citizen 0__** (matches "cit"):
			  - <nothing yet>	

			**__Humans__** (matches "hum"):
			  - Access to all standard channels (default member role)

			**__Trial Moderator__** (matches "tr"):
			  - More restricted version of Moderator permissions
			
			**__Muted__** 
			  - Denial of permission to send messages.
				`
			)
		let Perms = ["pet", 'staff', 'mod', 'colorist', 'kw', 'rebel', 'sargent', 'supreme', 'civilian', 'citizen0', 'human', 'trial', 'nerd', 'db', 'muted', 'bus', 'noexec', "antistun"];
		if (!args.length) {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		};
		const permission = args.slice(1).join(' ');
		if (permission == 'help') return message.channel.send(help)
		if (!args[0]) return message.channel.send("You must mention a user for this command to work!")
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.channel.send('invalid user '))
		};
		async function assign(usr, role, permName, index) {
			let data = await client.db.get("perms" + usr.id) || "0;0;0;0;0;0;0;0;0;0;0;0";
			data = data.split(";");
			const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id);
		
			if (Object.keys(client.config.indexes).includes(permName)) {//perm
				if (data[client.config.indexes[permName]] == "0") { //doesnt have
					if (mem) {
						mem.roles.remove(role)
							.catch((x) => message.channel.send("This user did not lose the permission's role."))
						};
					return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} doesn't have ${permName}!`)
					})
				} else {
					data[client.config.indexes[permName]] = "0";
					await client.db.set(`perms${usr.id}`, data.join(";"));
					if (mem) {
					mem.roles.remove(role)
						.catch((x) => message.channel.send(`There was an error whilst remove the role from this user: ${x}`))
					};
					return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has lost the ${permName} permission`)					
					});	
				};
			};
				if (mem) {	
				mem.roles.remove(role)
					.catch((x) => message.channel.send(`There was an error whilst remove the role from this user: ${x}`))
				};
			message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has lost the ${permName} permission`)					
			});		
		};
		
		if (permission.startsWith('"') && permission.endsWith('"')) {
			const rn = args.slice(1).join(' ').slice(1, -1);
			const role = client.guilds.cache.get(client.config.supportServer).roles.cache.find(x => x.name.toLowerCase() == rn.toLowerCase()) || client.guilds.cache.get(client.config.supportServer).roles.cache.find(x => x.name.toLowerCase().startsWith(rn.toLowerCase()));
			if (!role) return message.channel.send("I couldn't find a role by that name. Please check the usage for this command and arguments which it accepts.")
			const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id)
			if (!mem) return message.channel.send("That user is not a member of this support server!");
			if (role.position > ss.roles.highest.position) {
				return message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`You do not have permission to take this role as it is currently higher than your highest role in the support server`)
				})
			};			
			if (mem.roles.cache.has(role.id)) {
				mem.roles.remove(role)
				return message.channel.send({
					embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${mem.user.tag} has lost the ${role.name} role`)
				})
			} else {
				message.channel.send({
					embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} doesn't have the ${role.name} role`)
				})
			}
			return;
		}
		async function assignDBPerm(val, permName) {
			let value = await client.db.get(`${val}${usr.id}`);
				if (!value) {
					return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} doesn't have ${permName}!`)
					});
				} else if (value) {
					await client.db.delete(`${val}${usr.id}`)
					return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setDescription(`${usr.tag} has lost "${permName}"`)
						.setColor(message.author.color)
					});
				};	
			};		

		if (permission.startsWith('staff')) {
			assign(usr, client.config.roles.staff, 'staff');
		} else if (permission.startsWith('col')) {
			assign(usr, client.config.roles.col, 'colorist');
		} else if (permission.startsWith('mod')) {
			assign(usr, client.config.roles.mod.normal, 'moderator');
		} else if (permission.startsWith('tr')) {
			assign(usr, client.config.roles.mod.trial, 'Trial Mod')
		} else if (permission.startsWith('kw')) {
			assign(usr, client.config.roles.warrior, 'warrior')
		} else if (permission.startsWith('reb')) {
			assign(usr, client.config.roles.rebel, 'rebel')
		} else if (permission.startsWith('sarg')) {
			assign(usr, client.config.roles.sarg, 'sarg')
		} else if (permission.startsWith('ner')) {
			assign(usr, client.config.roles.nerd, 'nerd')
		} else if (permission.startsWith('sup')) {
			assign(usr, client.config.roles.supreme, 'supreme')
		} else if (permission.startsWith('civ')) {
			assign(usr, client.config.roles.civ, 'civilian')
		} else if (permission.startsWith('cit')) {
			assign(usr, client.config.roles.cit, 'citizen 0')
		} else if (permission.startsWith('muted')) {
			assign(usr, client.config.roles.muted, "muted");
		} else if (permission.startsWith('hum')) {
			assign(usr, client.config.roles.human, 'human (member)')
		} else if (permission.startsWith('db')) {
			assign(usr, client.config.roles.db, 'dbmanager')
		} else if (permission.startsWith("judg")) {
			assign(usr, client.config.roles.judge, "judge");
		} else if (permission.startsWith("bus")) {
			assign(usr, client.config.roles.businessman, 'businessman')
		} else if (permission.startsWith("dev")) {
			assign(usr, client.config.roles.botDeveloper, "botDeveloper");
		} else if (permission.startsWith("noexec")) {
			assignDBPerm("noexec", "noexec");
		} else if (permission.startsWith("antistun")) {
			assignDBPerm("antistun", 'antistun');
		} else if (permission.startsWith("pet")) {
			assignDBPerm("pet", "pet");
		} else {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		}
	},
};