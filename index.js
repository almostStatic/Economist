const keyv = require('keyv');
require('@keyv/sqlite');
const fs = require('fs');
const ms = require('ms');
const defaults = require('./config.js');
const express = require('express');
const app = express();
const delay = require('delay');
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const client = new Discord.Client({
	disableMentions: 'everyone',
});

const cantUsed = [
	"Why would you want to use this command?",
	"You're not cool enough to use this command!",
	"no can do pal",
	"hm.",
	"You lack sufficent permissions required in order to use this command. L",
	"Permissions are bad, Mkay",
]

client.db = new keyv('sqlite://./database.sqlite');
client.commands = new Discord.Collection();
client.comma = defaults.functions.comma;
client.getID = defaults.functions.getID;
client.cooldown = defaults.functions.cooldown;
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

client.on('ready', async() => {
	console.log(client.commands.map(x => x.name).join(", "))
	console.log(client.guilds.cache.map(x => x.name).join(', '))
	console.log(`Logged in as ${client.user.tag}`);
	client.channels.cache.get(client.config.channels.ready).send({
		embed: new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`Successfully logged in with ${client.guilds.cache.size} guilds cached, with ${client.users.cache.size} users.`)
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
	if (message.author.bot) return;
	let rand = Math.floor(Math.random() * 10);
	if(message.guild.id=="706845688969035897") rand *= 2;
	if (rand >= 18) {
		let old = await client.db.get(`briefcase${message.channel.id}`);
		let p = await client.db.get("prefix" + message.guild.id) || "~";
		if(old){}else{
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
	let prefix;
	if (message.channel.type != 'dm') {
	 prefix = await client.db.get('prefix' + message.guild.id);
	 if (!prefix) prefix = client.config.prefix;
	} else { prefix = client.config.prefix; };
	if (!prefix) prefix = client.config.prefix;
	if (!message.content.startsWith(prefix)) return;
	if (message.partial) message = await message.fetch();

	const ss = client.guilds.cache.get(client.config.supportServer);
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const mem = ss.member(message.author);
	const stun = await client.db.get('stun' + message.author.id);
	const antiStun = await client.db.get('antistun' + message.author.id);
	if (!antiStun) {} else { await client.db.delete('stun' + message.author.id);};
	if (!stun) {} else {
		if (stun.at > Date.now() - stun.time) {
			const stunnedAt = stun.at;
			const time = stun.time;//in minutes
			return message.channel.send(`You can't use any commands while you're stunned... ${client.comma(Math.round((stunnedAt - (Date.now() - time)) / ms('1m')))} ${Math.round((stunnedAt - (Date.now() - time) / ms('1m'))) != 1 ? 'minutes' : 'minute'} left.`) 
		};
	};
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	const fk = await client.db.get('fk' + message.author.id);
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
	if (mem.roles.cache.has(client.config.roles.rebel)) {
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
	if (command.guild && (message.channel.type == 'dm')) {
		return message.channel.send(`This command may not be executed inside a DM channel.`)
	};

	if (command.disabled) return message.channel.send({ 
		embed: new Discord.MessageEmbed()
		.setColor('#da0000')
		.setDescription(`This command has been disabled by ${client.users.cache.get(client.config.owner).tag}`)
	 })

	if (command.nerd && (!mem.roles.cache.has(client.config.roles.nerd))) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);		
	};

	if (command.dev && (!mem.roles.cache.has(client.config.roles.staff))) {
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

	message.guild.prefix = prefix;

	try {
		command.run(client, message, args);
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
	member.roles.add(rolePersist.split(';') || null);
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