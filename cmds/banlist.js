const Discord = require("discord.js")
module.exports = {
    name: "bans",
    aliases: ["banned", 'bans'],
    desc: 'See a list of users banned from the server, along with their IDs and the reason of their ban',
    usage: "bans",
    async run(client,message,args,prefix,jsonColor,sleep,done,error) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
        return message.channel.send(`${process.env.re} You do not have correct permissions to use this command.\n> You need the **ban members** permission!`)
    }
     message.guild.fetchBans(true)
        .then(async(bans) => {
            if (bans.size == 0) {
                return message.channel.send(`${process.env.gre} There are no users banned from **${message.guild.name}**!`)
            }
            if (!bans.reason) bans.reason = "no reason found";
            let bList = bans.map(b => `${b.user.tag} (${b.user.id}) | ${b.reason}`.toString()).join("\n")
            let embed;
                embed = new Discord.MessageEmbed()
                .setAuthor("Banned Users", message.guild.iconURL)
                .setDescription("```\n" + client.trim(bList, 2040) + "\n```")
                .setColor(jsonColor)
                .setTimestamp()
                message.channel.send({ embed })
            .catch(er => {
                message.reply(`${process.env.re} | I was unable to find your bans list.\n> Check my permissions`)
            });
        });
    },
};