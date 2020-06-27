const Discord = require('discord.js');
module.exports = {
	name: 'assign',
	aliases: ['give', 'take', 'assign'],
	description: 'add/remove a users permissions.',
	dev: true,
	guild: true,
	async run(client, message, args) {
		const help = new Discord.MessageEmbed()
		.setColor(message.author.color)
		.setTitle('Assignable Permissions')
		.setTimestamp()
		.addField('Note', 'Upon receiving these permissions, users will gain a role in the support server. This means, for them to receive the permission, they need to be a member of the support server!')
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

				**__Database Manager__** (matches "db"):
				- Access to \`${message.guild.prefix}set <key> <value>\` 
				- Access to \`${message.guild.prefix}delete <key>\`				  

			**__Colorist__** (matches "col"):
			  - Access to \`${message.guild.prefix}color <new color>\` 	

			**__Moderator__** (matches "mod"):
			  - Access to moderator commands (warn, kick, ban, etc)

			**__Warrior__** (matches "war"): 
			  - <nothing yet>

			**__Rebel__** (matches "reb"):
			  - Clears 3 second cooldown 

			**__Sargent__** (matches "sarg"): 
			  - <nothing yet>			

			**__Nerddd__** (matches "ner"):
			  - Access to bot logs

			**__Supreme__** (matches "sup"):
			  - <nothing yet>

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
		let Perms = ['staff', 'mod', 'colorist', 'warrior', 'rebel', 'sargent', 'supreme', 'civilian', 'citizen0', 'human', 'trial', 'nerd', 'db', 'muted', 'fk'];
		if (!args.length) {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		};
		const permission = args[0].toLowerCase();
		if (permission == 'help') return message.channel.send(help)
		if (!args[1]) return message.channel.send("You must mention a user for this command to work!")
	let usr;
	try {
		usr = await client.users.fetch(client.getID(args[1]))
	} catch (err) {
		usr = await client.users.fetch(args[1]).catch((x) => message.channel.send('invalid user '))
	};

		const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id);
		if (!mem) return message.channel.send(`That user is not in the suppot server and therefore may not be assigned this permission`);

		/**
		 * Assigns the given role ID to a member of the guild.
		 * If the user already has the role, it will remove the role from the user
		 * If the user does not have the role it will add it to them
		 * Use its power wisely.
		 * @param usr The user object to which this role must be assigned to 
		 * @param role The role ID of which must be assigned to the given `usr` object.
		 * @param permName The name to which this permision is associated with (will be displayed on success message)
		 * @extends roleAdd/roleRemove
		 */
		async function assign(usr, role, permName) {
			const mem = client.guilds.cache.get(client.config.supportServer).member(usr.id);
			if (!mem) return await message.channel.send(`\`${await client.users.fetch(usr.id, { cache: false }).tag}\` is not in the suppot server and therefore may not be assigned this permission`);
			if (mem.roles.cache.has(role)) {
				mem.roles.remove(role)
				message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${mem.user.tag} no longer has the ${permName} permission`)
				});
			} else {
				mem.roles.add(role)
				message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${mem.user.tag} has received the ${permName} permission`)					
				});
			};
		};
		if (permission.startsWith('staff')) {
			assign(usr, client.config.roles.staff, 'bot staff');
		} else if (permission.startsWith('col')) {
			assign(usr, client.config.roles.col, 'colorist');
		} else if (permission.startsWith('mod')) {
			assign(usr, client.config. roles.mod.normal, 'moderator');
		} else if (permission.startsWith('tr')) {
			assign(usr, client.config. roles.mod.trial, 'trial moderator')
		} else if (permission.startsWith('war')) {
			assign(usr, client.config.roles.warrior, 'warrior')
		} else if (permission.startsWith('reb')) {
			assign(usr, client.config.roles.rebel, 'rebel')
		} else if (permission.startsWith('sarg')) {
			assign(usr, client.config.roles.sarg, 'sargent')
		} else if (permission.startsWith('ner')) {
			assign(usr, client.config.roles.nerd, 'nerddd')
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
			assign(usr, client.config.roles.db, ':tools: Database Manager')
		} else if (permission.startsWith("fk")) {
			let fk = await client.db.get(`fk${usr.id}`);
			if (fk) {
				await client.db.delete(`fk${usr.id}`);
				message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} no longer has the FK permission`)
				})
			} else if (!fk) {
				await client.db.set(`fk${usr.id}`, true);
				message.channel.send({
					embed: new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received the FK permission`)
				})
			}
		} else {
			return message.channel.send("That isn't a valid permision type! The different types of permissions are: " + Perms.map(x => "`" + x + "`").join(', '));
		}
	},
};