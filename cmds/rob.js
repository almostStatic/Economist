const { MessageEmbed } = require('discord.js');
require('keyv');
const ms = require('ms');

module.exports = {
  name: 'rob',
  aliases: ['rob', 'ripoff'],
  category: 'ecn',
  description: 'Rob a user, stealing X amount of the User\'s balance',
  usage: 'rob <user>',
  async run(client, message, args) {
    const result = Math.floor(Math.random(1) * 10)
    let cooldown = await client.db.get('robc' + message.author.id);
		const data = client.cooldown(cooldown, message.createdTimestamp, ms('20m'));
		if (data) {
			return message.channel.send(`You must wait another ${data.mins} minutes before robbing someone again!`);
		} else {
			await client.db.set(`robc${message.author.id}`, Date.now());
		}

    function notEnough() {
      return message.channel.send("They don't have enough :dollar: in balance for you to rob!")
    }
    if (!args.length) return message.channel.send("You must specify a user who yo wish to rob!")
    let usr = await client.usr(args[0]).catch((x) => {});
    if (!usr) return message.channel.send("Whoops! I can't find that user");
    if (message.author.id == usr.id) return message.channel.send(`You can't rob yourself!`);
    if (result > 3) {
    let authorBal = await client.db.get('bal' + usr.id) || 0;
    authorBal = Number(authorBal)
    let amt = authorBal - Math.floor(Math.random() * authorBal);
    amt = Number(Math.trunc(amt / 5))
    const amountLeft = Number(Number(authorBal) - Number(amt));
    if (amountLeft < 0) return notEnough();
    await client.db.set('bal' + usr.id, amountLeft);
    let oldBal = await client.db.get('bal' + message.author.id) || 0;
    oldBal = Number(oldBal)
    const newBal = Number(oldBal + amt);
    await client.db.set('bal' + message.author.id, newBal)
    message.channel.send({
      embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has robbed :dollar: ${message.author.com == 1 ? amt : client.comma(amt)} (${amt.toString().length} digits) from ${usr.tag}'s account`)
    })
    usr.send({
      embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has robbed :dollar: ${message.author.com == 1 ? amt : client.comma(amt)} (${amt.toString().length} digits) from ${usr.tag}'s account`)
    }).catch((x) => console.log(x));
  } else {
    await client.db.set('stun' + message.author.id, `${message.createdTimestamp};${5 * ms('1m')}`)
    message.channel.send(`${message.author.tag} tried to rob ${usr.tag} but got caught and has been arrested for 5 minutes!`);
    await client.db.set("stunmsg" + message.author.id, `You can't use any commands while you're arrested! ($time)`)
    await client.db.set(`robc${message.author.id}`, Date.now());
    }
  }
}