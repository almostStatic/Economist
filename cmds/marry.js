const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'marry',
	aliases: ['marry'],
	description: '..',
	async run(client, message, args) {
		let spouse = await client.db.get("spouse" + message.author.id);
		let author, tag;
		if (spouse) {
			author = await client.users.fetch(spouse).catch((x)=>{})
			tag = `${author.username}#${author.discriminator}`;
		};
		if (spouse) return message.channel.send(`Oi! Don't even think about cheating on ${tag}. You can divorce them by using \`${message.guild.prefix}divorce\``);
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => {});
		};
		if(!usr) return message.channel.send("You must specify a user who you wish to marry!");
		if (usr.id == message.author.id) return message.channel.send("You can't marry yourself! :-(")
		let spouse2 = await client.db.get('spouse' + usr.id);
		let user, Tag;
		if (spouse2) {
			 user = await client.users.fetch(spouse2).catch((x)=>{})
			 Tag = `${user.username}#${user.discriminator}`;
		};
		if (spouse2) {
			return message.channel.send(`Too late. ${usr.tag} is already married to ${Tag}`);
		};
		let filter = m => m.author.id === usr.id;
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has proposed to ${usr.tag}!\n${usr.tag} has 60 seconds to accept. Type \`accept\` to accept!`)
		});
		message.channel.awaitMessages(filter, {
			max: 1,
			time: 60 * 1000,
			errors: ['time']
		})
			.then(async(col) => {
				if (col.first().content.toLowerCase() == 'accept') {
					await client.db.set("spouse" + message.author.id, usr.id);
					await client.db.set('spouse' + usr.id, message.author.id);
					message.channel.send({
						embed: new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`:sparkling_heart: ${message.author.tag} is now married to ${usr.tag}! \`${message.guild.prefix}spouse\``)
					});
				} else {
					message.channel.send(`It looks like ${usr.tag} didn't want to marry you, ${message.author}. Better luck next time!`)
				}
			})
				.catch((x) => {
					console.log(x);
					return message.reply(`Welp, ${usr.tag} didn't respond in time.`)
				});
	},
};