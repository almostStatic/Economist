const { MessageEmbed, escapeMarkdown } = require('discord.js');
const { Interface } = require('readline');

module.exports = {
	name: 'data',
	aliases: ['getdata', 'data', 'store'],
	description: "View a User's stored data",
	async run(client, message, args) {
		/**
		 * This function will show all stored data regarding a User.
		 * @param {String} usr ID of the target user whose data must be shown 
		 */
		async function data(usr) {
			const x1 = await message.channel.send('Fetching your data...')
      let keys = ['mute', 'antistun', 'stun', 'stunmsg', 'color', 'noComma', `cmds`, 'pet', 'bal', 'fish_rod', 'phone', 'number', 'phonebook', 'chillpills', 'dailyc', 'sentc', 'dialc', 'chillc', 'strokec', 'role', 'spouse', 'fishc', 'fish0', 'fish1', 'fish2', 'fish3', 'fish4', 'infcs', 'pet_name', 'searchc', 'deldatareqed', 'dprvc'];			
			keys = keys.concat(client.commands.map(x => `cmds.${x.name}${usr}`))
			let msg = '';
			for (x in keys) {
				let val = await client.db.get(`${keys[x]}${usr}`)
				if (!val) {
					if (message.content.toLowerCase().endsWith('-all')) {
						msg = `${msg}\n${keys[x]}=${require('util').inspect(val, { depth: 0 })}`;
					};
				} else {
					msg = `${msg}\n${keys[x]}=${require('util').inspect(val, { depth: 0 })}`;
				};
			};
			await x1.delete({ reason: 'idk' });
			if (!msg) return message.channel.send("No relative data was found.")
			message.channel.send(msg, { code: 'js', split: true })
		};
		const mem = client.guilds.cache.get(client.config.supportServer).members.cache.get(message.author.id).roles.cache.has(client.config.roles.staff);
		if (!mem || (mem != true)) {
			return data(message.author.id)
		} else {
			if (!args.length) args = [message.author.id];
			let user = await client.usr(args[0]).catch((x) => {});
			if (!user) {
				user = message.author;
			};
			data(user.id)
		};
	},
};