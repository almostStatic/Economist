const Discord = require('discord.js');

module.exports = {
	name: 'give',
	aliases: ['give', 'gv'],
	description: 'add permissions to users.',
	dev: true,
	guild: true,
	category: 'btsf',
	async run(client, message, args) {
		const help = new Discord.MessageEmbed()
		.setColor(message.author.color)
		.setTitle('Giveable Permissions')
		.setTimestamp()
		.addField("Permissions (char limit lol)", `
      **__Judge__** (matches "judg")
			  - Access to \`${message.guild.prefix}sentence\`		
		`)
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
        - Access to \`${message.guild.prefix}cooldowns\`
        
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
		let Perms = ["maxedpet", 'staff', 'mod', 'colorist', 'kw', 'rebel', 'sargent', 'supreme', 'civilian', 'citizen0', 'human', 'trial', 'nerd', 'db', 'muted', 'bus', 'noexec', "antistun", 'judge'];
		if (!args.length) {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		};
		const permission = args.slice(1).join(' ');
		if (args[0].toLowerCase().startsWith('help')) return message.channel.send(help)
		if (!args[0]) return message.channel.send("You must mention a user for this command to work!")
	let usr;
	try {
		usr = await client.users.fetch(client.getID(args[0]))
	} catch (err) {
		usr = await client.users.fetch(args[0]).catch((x) => {})
	};
	if(!usr) return message.reply("Try running the command again, this time actually ping a user llolololololl");
		
	async function assign(usr, role, permName, index) {
			let data = await client.db.get("perms" + usr.id) || "0;0;0;0;0;0;0;0;0;0;0;0";
			data = data.split(";");
			const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id);

			if (Object.keys(client.config.indexes).includes(permName)) {//perm
				if (data[client.config.indexes[permName]] == "1") { //already has
					const bool = mem && mem.roles.cache.has(role) ? "1" : "0";
					if (mem) {
						mem.roles.add(role)
							.catch((x) => message.channel.send("This user did not receive the permission's role."))
					};
						return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} already has ${permName} ${bool == "0" ? "but has not received the role" : ""}`)
					})
				} else {
					data[client.config.indexes[permName]] = "1";
					await client.db.set(`perms${usr.id}`, data.join(";"));
					if (mem) {
						mem.roles.add(role)
							.catch((x) => message.channel.send(`There was an error whilst adding the role to this user: ${x}`))
					}
					return message.channel.send({
						embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has received the ${permName} permission`)					
					});	
				};
			};
			if (!mem) return message.channel.send(`\`${usr.tag}\` is not in the suppot server and therefore may not be assigned this permission`);
		if (mem) {
			mem.roles.add(role)
				.catch((x) => message.channel.send(`There was an error whilst adding the role to this user: ${x}`))
		};
			message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has received the ${permName} permission`)					
			});		
		};
		if (permission.startsWith('"') && permission.endsWith('"')) {
			const ss = client.guilds.cache.get(client.config.supportServer).members.cache.get(message.author.id);
			if (!ss) return message.channel.send("You must be a member of the support server in order to use this command. This is to prevent potential abuse of this command");
			const rn = args.slice(1).join(' ').slice(1, -1);
			const role = client.guilds.cache.get(client.config.supportServer).roles.cache.find(x => x.name.toLowerCase() == rn.toLowerCase()) || client.guilds.cache.get(client.config.supportServer).roles.cache.find(x => x.name.toLowerCase().startsWith(rn.toLowerCase()));
			if (!role) return message.channel.send("I couldn't find a role by that name. Please check the usage for this command and arguments which it accepts.")
			const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id);
			if (!mem) return message.channel.send("That user is not a member of this support server!");
			if (role.position > ss.roles.highest.position) {
				return message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`You do not have permission to give this role as it is currently higher than your highest role in the support server`)
				})
			}
			if (mem.roles.cache.has(role.id)) {
				return message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${mem.user.tag} already has the ${role.name} role`)
				})
			} else {
				mem.roles.add(role.id)
				message.channel.send({
					embed: new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has received the ${role.name} role`)
				})
			}
			return;
		}
		async function assignDBPerm(val, toSet, permName) {
		let value = await client.db.get(`${val}${usr.id}`);
			if (!value) {
				await client.db.set(`${val}${usr.id}`, toSet)
				return message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received ${permName}`)
				});
			} else if (value) {
				return message.channel.send({
					embed: new Discord.MessageEmbed()
					.setDescription(`${usr.tag} already has ${permName}`)
					.setColor(message.author.color)
				});
			};	
		};
		if (permission.startsWith('staff')) {
			assign(usr, client.config.roles.staff, 'staff');
		} else if (permission.startsWith('col')) {
			assign(usr, client.config.roles.col, 'colorist');
		} else if (permission.startsWith('mod')) {
			assign(usr, client.config. roles.mod.normal, 'moderator');
		} else if (permission.startsWith('tr')) {
			assign(usr, client.config. roles.mod.trial, 'Trial Mod')
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
		} else if (permission.startsWith("bus")) {
			assign(usr, client.config.roles.businessman, 'businessman')
		} else if (permission.startsWith("judg")) {
			assign(usr, client.config.roles.judge, "judge");
		} else if (permission.startsWith("dev")) {
			assign(usr, client.config.roles.botDeveloper, "botDeveloper");
		} else if (permission.startsWith("noexec")) {
			assignDBPerm("noexec", 1, "noexec")
		} else if (permission.startsWith("antistun")) {
			assignDBPerm("antistun", 1, 'antistun')
		} else if (permission.startsWith('maxedpet')) {
			assignDBPerm('pet', client.config.maxedPet, "maxed pet");
		} else {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		}
	},
};