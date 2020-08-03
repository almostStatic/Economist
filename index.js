const keyv = require('keyv');
const fs = require('fs');
const ms = require('ms');
require("@keyv/sqlite")
const defaults = require('./config.js');
const express = require('express');
const app = express();
const delay = require('delay');
const Discord = require('discord.js');
const Intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
Intents.add(['GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS']);
const cooldowns = new Discord.Collection();
const client = new Discord.Client({
	disableMentions: 'everyone',
	ws: {
		intents: Intents,
		properties: {
			$browser: 'Discord Android',
			$device: 'Discord Android'
		},
	},
});

const cantUsed = [
	"Sorry m8, you're not allowed to use this command",
	"You don't have permission to use this command!",
]

client.db = new keyv('sqlite://./database.sqlite')
//client.db = new keyv(`mysql://asadcode_admin:${process.env.DB_PASSWORD}@${process.env.srv}/asadcode_economist`)
client.commands = new Discord.Collection();
client.comma = defaults.functions.comma;
client.getID = defaults.functions.getID;
client.cooldown = defaults.functions.cooldown;
client.trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
client.config = new Object(defaults.config);
client.usr = async function (str) {
	str = str.toString();
	if (!str) return;
	let usr;
	try {
		usr = await client.users.fetch(client.getID(str))
	} catch (err) {
		usr = await client.users.fetch(str).catch((x) => {})
	};	
	return usr;
}

client.getUserFromPing = function(mention, withID) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	if (!withID) withID = false;
	if (withID == true) {
		return id;
	} else {
	return client.users.cache.get(id);
	}
};
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	client.commands.set(command.name, command);
};

app.get('/', (req, res) => res.send(new Date()))

client.db.on("error", console.log)

client.on("messageDelete", async (message) => {
	if (message.author.bot) return;
	await client.db.set("snipe" + message.channel.id, {
		author: message.author.id,
		message: message.content || "n/a",
	});
})

client.on('ready', async() => {
//	console.log(client.commands.map(x => x.name).join(", "))
	//console.log(client.guilds.cache.map(x => x.name).join(', '))
	console.log(`Logged in as ${client.user.tag}`);
	client.guilds.cache.get(client.config.supportServer).members.fetch();
	client.channels.cache.get(client.config.channels.ready).send({
		embed: new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`Successfully logged in with ${client.guilds.cache.size} guilds cached with ${client.users.cache.size} users.`)
	});
	client.users.cache.forEach(async(user) => {
		let member = client.guilds.cache.get(client.config.supportServer).member(user.id);
		if (!member) return;
		let mute = await client.db.get(`mute${user.id}`);
		if (!mute) return;//user isnt muted, do nothing.
		let at = mute.at;
		let length = mute.length;
		if (mute.length == 0) return;//user has a permanent mute.
		if (mute.at - mute.length < Date.now() - mute.length) {
			member.roles.remove(client.config.roles.muted)
			client.channels.cache.get(client.config.channels.general)
				.send(`${client.config.emoji.tick} ${user.tag} has been unmuted. (time's up) Please don't get yourslef muted again :D`)
			await client.db.delete('mute' + user.id);
		};
	});
});

client.on('message', async message => {
	if(message.channel.type == "dm") return;
	if (message.guild) await message.guild.members.fetch();
	if (message.author.bot) return;
	if (message.system) return;
	if (message.webhookID) return;
	if (message.partial) message = await message.fetch();

	message.content = message.content.replace(/me/g, message.author.id)
	let rand = Math.floor(Math.random() * 10);
	if(message.guild.id == "706845688969035897") rand *= 2;
	if (rand >= 18) {
		let old = await client.db.get(`briefcase${message.channel.id}`);
		let p = await client.db.get("prefix" + message.guild.id) || "~";
		if(old) {} else {
			await client.db.set(`briefcase${message.channel.id}`, true);
			message.channel.send(`Someone just dropped their :briefcase: briefcase in this channel! Hurry up and steal it with \`${p}steal\``);
		};
	};
	if (message.guild.id == '706845688969035897') {
		let regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;

		let res = regex.test(message.content.toLowerCase());
		if (res == true) {
			message.delete({ reason: `Author posted an invite` })
			message.member.roles.add(client.config.roles.muted, "Muted for sending invite links.");
			await client.db.set('mute' + message.author.id, { at: Date.now(), length: 0 });
			message.channel.send(`${client.config.emoji.tick} ${message.author.tag} has received a permanet mute because of posting invite links. In order to get unmuted, please DM a moderator.`)
			message.member.send({
				embed: new Discord.MessageEmbed()
				.setColor('#da0000')
				.setDescription(`You have been muted because of posting invites. This is a permanent mute because I (the bot owner) really don't want any invites in circulation here. To get unmuted, please DM a moderator. If you continue to post invites, you will receive a permanent ban from this server. Take your invites somewhere else, ty.`)
			})
		};
	};
	let prefix = await client.db.get("prefix" + message.guild.id) || client.config.prefix;
	if (!message.content.startsWith(prefix)) return;

	const ss = client.guilds.cache.get(client.config.supportServer);
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const mem = ss.member(message.author.id);
	const stun = await client.db.get('stun' + message.author.id);
	const antiStun = await client.db.get('antistun' + message.author.id);
	if (!antiStun) {} else { await client.db.delete('stun' + message.author.id);};
	const stunMsg = await client.db.get("stunmsg" + message.author.id) || "You can't use any commands while you're stunned! ($time)"
	if (!stun) {} else {
		if (stun.at > Date.now() - stun.time && (!message.content.toLowerCase().startsWith('~data'))) {
			const stunnedAt = stun.at;
			const time = stun.time;//in minutes
			let stunTime = client.comma(Math.round((stunnedAt - (Date.now() - time)) / ms('1m')));
			let msg = stunMsg;
			if (!msg.includes('$time')) msg += "$time";
			msg = msg.replace(/\$time+/, `${stunTime} ${stunTime == 1 ? "minute" : "minutes"} left`);
			return message.channel.send(msg) 
		};
	};
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	message.author.color = await client.db.get('color' + message.author.id);
	if (!message.author.color) {
			message.author.color = client.config.defaultHexColor;//s[Math.floor(Math.random() * client.config.defaultHexColors.length)];
		};
	if (!command) return;

	let notAllowed = await client.db.get(`cmds.${command.name}${message.author.id}`);
	if (!notAllowed || (message.author.id == client.owner)) {

	} else {
		return message.channel.send("You don't have permissions to use this command!");
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());  
	};

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	let cooldownAmount = (command.cooldown || 5) * 1000;
	if (mem && (mem.roles.cache.has(client.config.roles.rebel))) {
		cooldownAmount = 0;
	};
	if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.channel.send("To prevent spam and overuse of commands, you may only use a command once every 3 seconds unless you have the Rebel permission. See `" + message.guild.prefix + 'perks` for more information.');		
		};
	};
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	if (!command.guild) command.guild = false;
	if (!command.dev) command.dev = false;
	if (!command.col) command.col = false;
	if (!command.nerd) command.nerd = false;
	if (!command.disabled) command.disabled = false;
	if (!command.supreme) command.supreme = false;
	if (!command.kw) command.kw = false;
	if (command.guild && (message.channel.type == 'dm')) {
		return message.channel.send(`This command may not be executed inside a DM channel.`)
	};

	if (command.disabled) return message.channel.send({ 
		embed: new Discord.MessageEmbed()
		.setColor('#da0000')
		.setDescription(`This command has been disabled by ${client.users.cache.get(client.config.owner).tag}`)
	 })

	if (command.nerd && (mem && (!mem.roles.cache.has(client.config.roles.nerd)))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);		
	};

	if (command.kw && (mem && (!mem.roles.cache.has(client.config.roles.warrior)))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);		
	};

	if (command.dev && (!mem || (!mem.roles.cache.has(client.config.roles.staff)))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	};

	if (command.db && (!mem.roles.cache.has(client.config.roles.db))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.supreme && (!mem.roles.cache.has(client.config.roles.supreme))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.col && (!mem.roles.cache.has(client.config.roles.col))) {
		return message.channel.send(`You're not colourful enough to use this command!`);
	};	

if (command.judge && (!mem.roles.cache.has(client.config.roles.judge))) {
		return message.channel.send(`You must be a judge in order to use this command!`);
	};	

	message.guild.prefix = prefix;
	let commasEnabled = await client.db.get("noComma" + message.author.id);
	if (commasEnabled) {
		message.author.com = 1;
	} else {
		message.author.com = 0;
	}
	 command.run(client, message, args)
		.catch((error) => {
			console.log(error)
			return message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#aa0000")
				.setDescription(`Sorry, but an error occured!\n${error}`)
			})
		})

	try {
		let old = await client.db.get('cmds');
		await client.db.set('cmds', Number(old + 1));
		let Old = await client.db.get("cmds" + message.author.id);
		await client.db.set('cmds' + message.author.id, Number(Old + 1));	
	} catch (err) {
		message.channel.send(`Error: ${err}`, { code: 'css' })
	};
});

client.on('guildMemberAdd', async (member) => {
	if (member.guild.id != client.config.supportServer) return;
	if (member.user.bot) return;
	await member.roles.add(client.config.roles.memberRole)
	const channel = member.guild.channels.cache.get(client.config.channels.general);
	let rolePersist = await client.db.get('persist' + member.id) || client.config.roles.memberRole;
	let nick = await client.db.get('nick' + member.id);
	if (nick) await member.setNickname(nick);
	let wmc = await client.db.get('welcome' + member.id);
	member.roles.add(rolePersist.split(';') || null)
		.catch((x) => {});
	if (wmc) {
		channel.send(`Welcome back ${member}! Any roles you had when you left the server have been re-assigned.`)
		return;
	};
	channel.send(`Welcome ${member} to ${member.guild.name}! :dollar: 500 has been added to your balance, also note that briefcases as twice as likely to spawn here compared to other servers. I hope you enjoy your stay >3`)
	let oldBal = await client.db.get('bal' + member.user.id) || 0;
	await client.db.set('bal' + member.user.id, oldBal + 500);
	await client.db.set('welcome' + member.user.id, true);
});

process.on('unhandledRejection', (e) => {
	console.error(e);
	client.channels.cache.get(client.config.channels.error)
		.send({
			embed: new Discord.MessageEmbed()
			.setColor('#da0000')
			.setDescription(
				`:x: **Error:** => \`${e}\`\n`
			)
			.setTimestamp()
		})
});

client.on('error', x => console.log(x));

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	if (!newMember.nickname) { 
		await client.db.delete('nick' + oldMember.user.id);
	};
	if (oldMember.nickname != newMember.nickname) {
		 await client.db.set('nick' + oldMember.user.id);
		 console.log('set.');
	};
	if (oldMember.roles.cache.map(x => x.id).join(';') != newMember.roles.cache.map(x => x.id).join(';')) {
		await client.db.set(`persist${oldMember.id}`, newMember.roles.cache.map(x => x.id).join(';'));
	};
});

client.login(process.env.token);
app.listen(3000, () => { console.clear(); console.log('server started');})