const { MessageEmbed, escapeMarkdown } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  name: 'leaderboard',
  aliases : ['lb', 'topbal'],
  category: 'utl',
  description: 'See stuff about the bot',
  async run(client, message, args) {
    var level =  await client.db.startsWith("xplvl", { sort: ".data", limit: 10 })
    const data = level.map((d) => ids.push([ d.ID.slice(5), d.data ]));
    // [ "ID", "level" ]
    var counter = 1;
    Promise.all(
      data.map(async(x) => {
        const user = await client.users.fetch(x[0]);
        return `${counter++}. ${escapeMarkdown(user.tag)}: Level **${x[1]}**`
      })
    )
      .then((ar) => ar.join("\n"))
        .then((data) => {
          const embed = new MessageEmbed()
          .setColor('#DAA520')
          .setTitle('Top 10 - Levels Leaderboard')
          .setDescription(data)
           .setFooter('XP System', client.user.avatarURL())
           message.channel.send(embed);      
        })
          .catch((err) => message.channel.send(`${client.config.emoji.err} There was an error whilst executing this function: \`${err}\``))
  },
};