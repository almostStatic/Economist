const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'debugmode',
	aliases: ['debug', 'debugmode'],
	category: 'utl',	
	description: "Tooggle 'debug mode' on/off depending on the current setting.\nThis mode will enable certain features within the bot that allow staff to debug errors; this may be added to your account in order to assist us in tracking errors and resolving them.",
	async run(client, message, args) {
		const check = await client.db.get("debug" + message.author.id)
		if (!check) {
			await client.db.set("debug" + message.author.id, true)
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has enabled debug mode!`)
			})
		} else {
			await client.db.delete("debug" + message.author.id, true)
			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has disabled debug mode!`)
			})	
		}
	} 
}