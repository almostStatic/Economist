const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "cat",
	aliases: ["cat"],
	category: "fun",
	description: 'Get a picture of a random cat',
	usage: 'cat',
	async run(client, message, args) {
		if(!message.guild.me.hasPermission("EMBED_LINKS")) {
			return message.channel.send("I need the Embed Links permission for this command to work.")
		}
		let data = await fetch("https://api.thecatapi.com/v1/images/search").then(res => res.json());
		message.channel.send({
			embed: new Discord.MessageEmbed()
			.setTitle("Meow")
			.setImage(data[0].url)
			.setColor(message.author.color)
			.setTimestamp()
		})
	},
}