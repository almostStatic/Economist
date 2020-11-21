const keyv = require('keyv');
const fs = require('fs');
const ms = require('ms');
require("@keyv/sqlite");
// Used for posting bot stats
const dotenv = require("dotenv")
dotenv.config();
//process.exit()
const defaults = require('./config.js');
const express = require('express');
const app = require('./dashboard/app')
//express();
const delay = require('delay');
const Discord = require('discord.js');

// MONGO ADDED - Yw Static
const { Database } = require(`quickmongo`)
const db = new Database(process.env.mongoDB)

// const Intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
// Intents.add(['GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS']);
const cooldowns = new Discord.Collection();
const client = new Discord.Client({
	disableMentions: 'everyone',
	ws: {
//		intents: Intents,
	},
});
const cantUsed = [
	"Sorry m8, you're not allowed to use this command",
	"You don't have permission to use this command!",
];

const Statcord = require("statcord.js");

const statcord = new Statcord.Client({
    client,
    key: process.env.StatCord,
    postCpuStatistics: false, 
    postMemStatistics: false, 
    postNetworkStatistics: false
});

statcord.on("autopost-start", () => {
    console.log("Started autopost");
});

statcord.on("post", status => {
    if (!status) console.log("Successful post");
    else console.error(status);
});

client.db = db;
// Changed Keyv to store ONLY cooldowns since mongo gey with removing them
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
client.cdb = new keyv('sqlite://./cooldownDB.sqlite')
// client.dashboard = require('./dashboard/app.js');
client.commands = new Discord.Collection();
client.comma = defaults.functions.comma;
client.getID = defaults.functions.getID;
client.noExponents = defaults.functions.noExponents;
client.cooldown = defaults.functions.cooldown;
client.trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
client.trimWithoutDots = (str, max) => ((str.length > max) ? `${str.slice(0, max)}` : str);
client.hyphen = defaults.functions.hyphen;
client.config = (defaults.config);
client.format = defaults.functions.format;
client.digits = defaults.functions.digits;
client.inspect = defaults.functions.Inspect;
client.usr = async function (str) {
	if (!str) return;
	str = str.toString();
	let usr;
	try {
		usr = await client.users.fetch(client.getID(str))
	} catch (err) {
		usr = await client.users.fetch(str).catch((x) => {})
	};
	return usr;
};

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

// app.get('/', (req, res) => res.send(new Date()))

client.db.on("error", console.log)

client.on('messageUpdate', async(oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.guild.id != client.config.supportServer) return; 
	client.channels.cache.get(client.config.channels.msgLogs).send("", {
		embed: new Discord.MessageEmbed()
		.setTitle('Message Edited in #' + oldMessage.channel.name)
		.setThumbnail(oldMessage.author.displayAvatarURL())
		.setColor("RANDOM")
		.addField("Old Message", client.trim(oldMessage.content, 1024), true)
		.addField("New Message", client.trim(newMessage.content, 1024), true)
		.setFooter("Edited At", newMessage.author.avatarURL())
		.setTimestamp()
	})
});

client.on("messageDelete", async (message) => {
	if (message.guild.id !== client.config.supportServer) return;
	const logs = client.channels.cache.get(client.config.channels.msgLogs);
	const embed = new Discord.MessageEmbed()
	.setColor(client.config.colors.red)
	.setTitle("Message Deleted")
	.addField("Message Sent At", require("moment")(message.createdTimestamp))
	.setFooter("Deleted At")
	.setTimestamp()
	.setAuthor(message.author.tag, message.author.displayAvatarURL(), message.author.displayAvatarURL());
	if (!message.content && (message.attachments.size)) {
		embed
			.setDescription(`Attachments Detected: ${message.attachments.map(x => `[Attachment](${x.url})`).join(" ")}`)
			.setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"))
	} else {
		embed
			.setDescription(message["content"])
	}
	logs.send({ embed: embed })
});


client.on("messageDelete", async (message) => {
	if (message.author.bot) return;
	if (!message.content) return;
 	await client.db.set("snipe" + message.channel.id, {
		author: message.author.id,
		message: message.content || "n/a",
		at: Date.now()
	});
})

client.on("messageDelete", async (message) => {
  	if (message.guild.id !== client.config.supportServer) return;
	const embed = new Discord.MessageEmbed()
	.setColor(client.config.colors.red)
	.setTitle("Message Deleted in #" + message.channel.name)
	.setAuthor(message.author.tag, message.author.avatarURL(), message.author.avatarURL());
	if (!message.content) {
		embed
			.setDescription(`Attachments Detected: ${message.attachments.first().url}`)
			.setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"))
	}
});

client.on('ready', async() => {
	statcord.autopost();
	console.log("\u2705")
  // client.dashboard.load(client);
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache['size']} servers - ~support to join our support server for free 💵 500`,
			type: 'WATCHING',
		},
		status: 'dnd'
	})	
//	console.log(client.commands.map(x => x.name).join(", "))
	//console.log(client.guilds.cache.map(x => x.name).join(', '))
	console.log(`Logged in as ${client.user.tag}`);
	client.guilds.cache.get(client.config.supportServer).members.fetch();
	client.channels.cache.get(client.config.channels.ready).send({
		embed: new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`Successfully logged in; ${client.guilds.cache.size} guilds cached with ${client.users.cache.size} users.`)
	});
	client.users.cache.forEach(async(user) => {
		let member = client.guilds.cache.get(client.config.supportServer).member(user.id);
		if (!member) return;
		let mute = await client.db.get(`mute${user.id}`);
		if (!mute) return;//user isnt muted, do nothing.
		if (mute.length == 0) return;//user has a permanent mute.
		if (mute.at - mute.length < Date.now() - mute.length) {
			member.roles.remove(client.config.roles.muted)
			client.channels.cache.get(client.config.channels.general)
				.send(`${client.config.emoji.tick} ${user.tag} has been unmuted. (time's up) Please don't get yourslef muted again :D`)
			await client.db.delete('mute' + user.id);
		};
	});
	client.keys = ["petbu", "upgr", 'mute', 'noexec', 'antistun', 'stun', 'stunmsg', 'color', 'noComma', `cmds`, 'pet', 'bal', 'fish_rod', 'phone', 'number', 'phonebook', 'chillpills', 'dailyc', 'sentc', 'dialc', 'chillc', 'strokec', 'role', 'spouse', 'fishc', 'fish0', 'fish1', 'fish2', 'fish3', 'fish4', 'infcs', 'petname', 'searchc', 'deldatareqed', 'debug', 'bio', 'replacers', 'dprvc', 'robc', 'srchc', 'feedc', 'dwngrdc', 'welcome', "persist", "wmc", 'blacklist', 'xp', 'xpc', 'xplvl', "perms"].sort();
});

client.on("guildMemberAdd", async(member) => {
	if (member.user.bot) return;
		let owner = client.users.cache.get(client.config.owner).tag;
    var blacklisted = await client.db.get("blacklist" + member.user.id);
		let channel = client.channels.cache.get(client.config.channels.general)
		//owen repellent below;
  if (client.config.supportServer.includes(member.guild.id)){
      if (blacklisted) {
        let blacklistedRole = member.guild.roles.cache.get(client.config.roles.blacklistedRole);
        await member.roles.add(blacklistedRole.id, "User Was bot banned by a developer or owner.");
      }
  }
	if ([client.config.supportServer].includes(member.guild.id)){
		if (['462220963224879105', '157558716844081152', '336920581624692737', '540130125136658432', '163715276733415426', '684368759581835303'].includes(member.user.id)) {
			let muted = member.guild.roles.cache.get(client.config.roles.muted);
		await	member.roles.add(muted.id);
		reason = 'owen repellent';
		await	channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#36393e")
				.setDescription(`${member.user.tag} has received a 10000000000000000000000 minute mute for "${reason}". If you beleive this is a mistake (which it's not), please DM ${owner}. They were sent the following message:`)
			});
		await	channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 10000000000000000000000 minute mute from ${member.guild.name} for "${reason}". If you beleive this is a mistake, then feel free to DM ${owner}`)
				.addField("Moderator", client.user.tag, true)
				.addField("Reason", reason, true)
			});
			await member.send({
				embed: new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 10000000000000000000000 minute mute from ${member.guild.name} for "${reason}" If you beleive this is a mistake, then feel free to DM ${owner}`)
				.addField("Moderator", client.user.tag, true)
				.addField("Reason", reason, true)
			}).catch((error) => {  });
		};
	};

	//mute new members if they are newer than 2 weeks

	if (member.guild.id == client.config.supportServer) {
		if (Number(member.user.createdTimestamp) > Date.now() - 1209600000) {
			let mute = member.guild.roles.cache.get(client.config.roles.muted)
			member.roles.add(mute.id);
			channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#000001")
				.setDescription(`${member.user.tag} has received a 10000000000000000000000 minute mute for "[AUTOMOD] anti-raid (DM ${owner} to get unmuted)". If you beleive this is a mistake, please DM ${owner}. They were sent the following message:`)
			});
			channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 10000000000000000000000 minute mute from ${member.guild.name} because of "[AUTOMOD] anti-raid (DM ${owner} to get unmuted)". If you beleive this is a mistake, then feel free to DM ${owner}`)
				.addField("Moderator", client.user.tag, true)
				.addField("Reason", `[AUTOMOD] anti-raid (dm ${owner} to get unmuted)`, true)
			});
			member.send({
				embed: new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 10000000000000000000000 minute mute from ${member.guild.name} because of "[AUTOMOD] anti-raid (DM ${owner} to get unmuted)". If you beleive this is a mistake, then feel free to DM ${owner}`)
				.addField("Moderator", client.user.tag, true)
				.addField("Reason", `[AUTOMOD] anti-raid (DM ${owner} to get unmuted)`, true)
			})
			.catch((e) => {});
		};
		client.channels.cache.get(client.config.channels.memberLog).send({
			embed: new Discord.MessageEmbed()
			.setTimestamp()
			.setColor('#00FF0C')
			.setAuthor(member.user.tag, member.user.avatarURL())
			.setFooter(`Member Joined • ID: ${member.user.id}`, member.user.avatarURL())
		})
	} else {
		return;
	};
});

client.on('guildMemberRemove', async(member) => {
	if (member.guild.id == client.config.supportServer) {
			client.channels.cache.get(client.config.channels.general).send({
				embed: new Discord.MessageEmbed()
				.setTimestamp()
				.setColor('#da0000')
				.setAuthor(member.user.tag, member.user.avatarURL())
				.setFooter(`Member Left • ID: ${member.user.id}`,
				member.user.avatarURL())
			})
			client.channels.cache.get(client.config.channels.memberLog).send({
				embed: new Discord.MessageEmbed()
				.setTimestamp()
				.setColor('#da0000')
				.setAuthor(member.user.tag, member.user.avatarURL())
				.setFooter(`Member Left • ID: ${member.user.id}`,
				member.user.avatarURL())
			})
	}
});

client.on('message', async message => {
	//67201089
  const blacklisted = await client.db.get("blacklist" + message.author.id);
	if (message.channel.type == "dm") return;
	//if (message.guild) await message.guild.members.fetch();
	if (message.author.bot) return;
	if (message.system) return;
	if (message.webhookID) return
	if (message.partial) message = await message.fetch();
	
  let prefix = await client.db.get("prefix" + message.guild.id) || client.config.prefix;
	if (message.guild.id == client.config.supportServer) {
		let coold = await client.db.get("xpc" + message.author.id) || 0;
		if (message.createdTimestamp < (coold + 60_000)) {
		} else {
			//no cooldown; add xp.
			var lvl = await client.db.get("xplvl" + message.author.id) || 1;
			lvl = Number(lvl);
			var xp = await client.db.get("xp" + message.author.id) || 0;
			xp = Number(xp);
			xp = xp + getRandomInt(14, 35);
			if ((xp / 200) > lvl) {
				message.channel.send(`Congrats ${message.author}, you've levelled up! You're now level **${lvl + 1}**! View your XP and level by typing \`${message.guild.prefix}level\``);
				await client.db.set("xplvl" + message.author.id, lvl + 1);
			};
			await client.db.set("xp" + message.author.id, xp);
			await client.db.set("xpc" + message.author.id, message.createdTimestamp);
		};
	};

  if (message.content.startsWith(`<@${client.user.id}> prefix`) || message.content.startsWith(`<@!${client.user.id}> prefix`)){
    const embP = new Discord.MessageEmbed()
      .setDescription(`The Current guild prefix is: \`${prefix}\``)
    message.channel.send(embP)
  };
        message.content = message.content.replace(/myid/g, message.author.id);
	const replacers = await client.db.get('replacers' + message.author.id) || {};
	if (replacers) {
		for (const x in replacers) {
			//console.log(x) --> "test"
			message.content = message.content.replace(new RegExp(`\{${x}\}`), replacers[x].content);
		};
	};
	let rand = Math.floor(Math.random() * 10);
	if(message.guild.id == "706845688969035897") rand *= 2;
	if (rand < 2) {
    let old = await client.db.get(`briefcase${message.channel.id}`);
		let p = await client.db.get("prefix" + message.guild.id) || "~";
		if (old) {} else {
			if (rand > 7) {
				await client.db.set(`briefcase${message.channel.id}`, true);
				message.channel.send(`Someone just dropped their :briefcase: briefcase in this channel! Hurry up and steal it with \`${p}steal\``);
			};
		};
	};
	if (message.guild.id == '706845688969035897' && (message.author.id != client.config.owner)) {
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
	message.author.debug = await client.db.get('debug' + message.author.id) || false
	if (!message.content.startsWith(prefix)) return;
	if (message.author.debug != false) {
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Message Content Parsed As:")
			.setDescription("```\n" + message.content + "\n```")
		})
	}
	const Perms = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0";
	const perms = Perms.split(";");
	const ss = client.guilds.cache.get(client.config.supportServer);
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const mem = ss.member(message.author.id);
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!message.guild.me.permissionsIn(message.channel).toArray().includes('SEND_MESSAGES')) return;
  if (blacklisted) return message.channel.send(`You're not allowed to use any commands while you're blacklisted! (-${Date.now()} minutes left)`)
	if (!command || (command)) {
		if (["ban", "mute", "warn", "infract", "infractions"].includes(commandName)) {

		} else {
			let stun = await client.db.get('stun' + message.author.id);
			const antiStun = await client.db.get('antistun' + message.author.id);
			if (!antiStun) {} else { await client.db.delete('stun' + message.author.id);};
			const stunMsg = await client.db.get("stunmsg" + message.author.id) || "You can't use any commands while you're stunned! ($time)"
			if (!stun) {} else {
				stun = stun.split(";");
				stun[0] = Number(stun[0]);
				stun[1] = Number(stun[1]);	
				if (stun[0] > Date.now() - stun[1] && (!message.content.toLowerCase().startsWith('~data'))) {
					const time = stun.time;//in minutes
					let stunTime = client.comma(Math.round((stun[0] - (Date.now() - stun[1])) / ms('1m')));
					let msg = stunMsg;
					if (!msg.includes('$time')) msg += "$time";
					msg = msg.replace(/\$time+/, `${stunTime} ${stunTime == 1 ? "minute" : "minutes"} left`);
					return message.channel.send(msg)
				};
			};
		};
	}
	message.author.color = await client.db.get('color' + message.author.id);
	if (!message.author.color) {
			message.author.color = client.config.defaultHexColor;//s[Math.floor(Math.random() * client.config.defaultHexColors.length)];
	} else {
		message.author.colors = message.author.color.split(";");
		message.author.color = message.author.color.split(";")[Math.floor(Math.random() * message.author.color.split(";").length || 1)];
	}
	if (!command) return;
  statcord.postCommand(command.name, message.author.id);
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
		"botDeveloper;businessman;colorist;dbmanager;judge;nerd;rebel;sarg;staff;supreme;updates;warrior"
	if (perms[6] != "0") {
		cooldownAmount = 0;
	};
	if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.channel.send(`You must wait another ${expirationTime.toFixed(1)} before using another command! In order to remove this cooldown, type \`${message.guild.prefix}perks\``);
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
	if (!command.botDeveloper) command.botDeveloper = false;
	if (command.guild && (message.channel.type == 'dm')) {
		return message.channel.send(`This command may not be executed inside a DM channel.`)
	};

	if (command.disabled) return message.channel.send({
		embed: new Discord.MessageEmbed()
		.setColor('#da0000')
		.setDescription(`This command has been disabled by ${client.users.cache.get(client.config.owner).tag}`)
	 })

	if (command.nerd && (perms[5] != "1")) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	};

	if (command.kw && (perms[11] != "1")) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	};

	if (command.dev && (perms[8] != "1")) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	};

	if (command.db && (perms[3] != "1")) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.supreme && (perms[9] != "1")) {
		return message.reply(cantUsed[Math.floor(Math.random() * cantUsed.length)]);
	}

	if (command.botDeveloper && (!mem.roles.cache.has(client.config.roles.botDeveloper) || perms[0] != "1")) {
		return message.channel.send(`${client.config.emoji.err} This command can only be used by Bot Developers!`);
	}

	if (command.col && (perms[2] != "1")) {
		return message.channel.send(`You're not colourful enough to use this command!`);
	};

if (command.judge && (perms[4] != "1")) {
		return message.channel.send(`You must be a judge in order to use this command!`);
	};

	message.guild.prefix = prefix;
	let commasEnabled = await client.db.get("noComma" + message.author.id);
	if (commasEnabled) {
		message.author.com = 1;
	} else {
		message.author.com = 0;
	}
	try {
		await command.run(client, message, args)

	} catch (e) {
			console.log(`Error on command ${command.name}; message ${message.content}. MESSAGE LINK: ${message.url} . Err: ${e.stack}`)
			message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor("#aa0000")
				.setTitle("Command Error")
				.setDescription(`\`\`\`\n${e.stack}\n\`\`\``)
			})
	}

	try {
		let old = await client.db.get('cmds');
		await client.db.set('cmds', Number(old + 1));
		let Old = await client.db.get("cmds" + message.author.id);
		await client.db.set('cmds' + message.author.id, Number(Old + 1));
	} catch (err) {
		message.channel.send(`Error: ${err}`, { code: 'xl' })
	};
});

client.on('guildMemberAdd', async (member) => {
	if (member.guild.id != client.config.supportServer) return;
	if (member.user.bot) return;
	const channel = member.guild.channels.cache.get(client.config.channels.general);
	let rolePersist = await client.db.get('persist' + member.id) || `${client.config.roles.memberRole}`;
	let nick = await client.db.get('nick' + member.id);
	if (nick) await member.setNickname(nick);
	member.roles.add(rolePersist.split(';') || null)
		.catch((x) => {});
	let wmc = await client.db.get("upgr" + member.id) || "";
	if (wmc.split(";").includes("wmc")) {
		channel.send(`Welcome back ${member}! Any roles you had when you left the server have been reassigned.`)
		return;
	};
	channel.send(`Welcome ${member} to ${member.guild.name}! :dollar: 500 has been added to your balance, also note that briefcases are as twice as likely to spawn here compared to other servers. I hope you enjoy your stay >3`)
	let oldBal = await client.db.get('bal' + member.user.id) || 0;
	let upgr = wmc;
	if (upgr.split(";").length == 1 && (upgr.split(";")[0] == "")) {
		upgr += "wmc";
	} else {
		upgr += ";wmc";
	}
	await client.db.set('bal' + member.user.id, oldBal + 500);
	await client.db.set('upgr' + member.user.id, upgr);
});

process.on('unhandledRejection', (e) => {
	console.error(e);
	client.channels.cache.get(client.config.channels.error)
		.send({
			embed: new Discord.MessageEmbed()
			.setColor('#da0000')
			.setDescription(
				`\`\`\`xl\n${e.stack}\n\`\`\``
			)
			.setTimestamp()
		})
});

client.on('error', x => console.log(x));

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	if (oldMember.guild.id != client.config.supportServer) return; //ignore other servers
	if (!newMember.nickname) {
		await client.db.delete('nick' + oldMember.user.id);
	};
	if (oldMember.nickname != newMember.nickname) {
		 await client.db.set('nick' + oldMember.user.id, newMember.nickname);
	};
	const oldRoles = oldMember.roles.cache.map(x => x.id).join(";")
	const newRoles = newMember.roles.cache.map(x => x.id).join(";")
	if (oldRoles != newRoles) {
		await client.db.set(`persist${oldMember.id}`, newRoles);
	};
});
// Booster Roles added and paid
client.on("guildMemberUpdate", async (oldUser, newUser) => {
	let x = await client.db.get(`bal${oldUser.id}`) || 0;
		x = Number(x);
	let boostPay = Number(client.config.boostPay)
	const boostAnnCh = client.channels.cache.get(client.config.channels.boostAnnCh);
	const roleTest = client.guilds.cache.get(client.config.supportServer).roles.cache.get(client.config.roles.boostRole)
	if (oldUser.guild.id !== client.config.supportServer) return;
	if (oldUser.roles.cache.size < newUser.roles.cache.size) {
	if (oldUser.roles.cache.has(roleTest.id)) return;
	if (!newUser.roles.cache.has(roleTest.id)) return;
	await client.db.set("bal" + newUser.id, parseInt(x + boostPay))
	boostAnnCh.send(`${newUser} has boosted the support server and received ${boostPay}, as well as the Booster role.`)
	};
});

client.login(process.env.token);
//app.listen(3000, () => { console.clear(); console.log('server started');})

/**
 * Code authored by @almostStatic (Copyright 2005 - 2020)
 */
