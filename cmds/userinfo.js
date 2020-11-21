const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "userinfo",
	aliases: ["user", "who", "whois", 'userinfo'],
	usage: 'userinfo <@user, or ID>',
	category: "utl",
	description: 'See some basic user infrormation',
	async run(client, message, args) {
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(' ');
			return newStr;
		};
		function date(_date = Date.now()) {
			return moment(_date).format('MMMM Do YYYY, h:mm:ss A');
		}
		function getPerms(user) {
			str = user.permissions.toArray().map(x => x.toString()).join(', ');
			var i = 0;
			for(i; i < str.length; i++) {
				str = format(str);
			};
			return str;
		};
		if (!args.length) args = [message.author.id];
		var user = await client.usr(args[0]).catch((x) => {});
		var member = await message.guild.members.fetch(user.id)
			.catch((err) => {});
		let flags = Object.keys(Discord.UserFlags.FLAGS).map(x => {
        if (user.flags.has(x)) {
            return format(x);
        } else {
            return 'false';
        };
    }).join(", ").replace(/false, /g,'').replace(", false",'');
		
		if (!member) {
			return message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription("This user is not a member of this server—this means that very limited information will be displayed.")
				.setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png' }))
				.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, format: "png" }))
				.addField("Joined Discord At", date(user.createdTimestamp), true)
				.addField("Bot", user.bot, true)
				.addField("Detected Flags", flags || "`No Flags`", true)
			})
		} else { //is member
		const roles = member.roles.cache.map(x => x.toString());
		var rls = "";
		roles.forEach((a) => {
			if (`${rls}${a}`.length > 1024) {
				return null;
			} else {
				rls = `${rls} ${a}`;
			}
		});
			return message.channel.send({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png' }))
				.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true, format: "png" }))
				.addField("Display Name", member.displayName, true)
				.addField("Joined Discord At", date(user.createdTimestamp), true)
				.addField("Joined Server At", date(member.joinedTimestamp), true)
				.addField("Bot", user.bot, true)
				.addField("Detected Flags", flags, true)
				.addField("Highest Role", member.roles.highest, true)
				.addField(`Roles [${member.roles.cache.size}]`, rls)
				.addField("Permissions", getPerms(member))
			})
		};
	},
}