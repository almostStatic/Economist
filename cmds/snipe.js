const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "snipe",
	aliases: ['snipe', 'sn'],
	description: 'View the last deleted message n the current channel',
	kw: true,
	async run(client, message, args) { 
		let snipedMsg = await client.db.get("snipe" + message.channel.id)
		if(!snipedMsg) return message.channel.send("Nothing to snipe here!");
		const user = await client.users.fetch(snipedMsg.author) || message.author;
		const tag = `${user.username}#${user.discriminator}`;
		const av = user.displayAvatarURL({ dynamic: true });
		let EM = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Sniped Message")
			.setAuthor(tag, av)
			.setDescription(snipedMsg.message)
			.setTimestamp();
		message.channel.send("", {
			embed: EM 
		}).catch((e) => { message.reply("i need the embed links permission for this to work!") })		
	}
}