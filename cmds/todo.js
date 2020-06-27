module.exports={name:'todo',aliases:['todo'],descrption:"see the bot owner's to do list...",async run(client,message,args){
	return message.channel.send(
`
**TODO**
- Make a command thatcan that can be used to sweat on the bot and increase lvl of pet
	- ~~Make the ability to name your pet~~ permission only
	- Make it so you can name your pet **once** only and need extra perms to do so
	- ~~add \`~fish\`~~
	- ~~Add \`~color <new color>\`~~
	- ~~Add \`~disown\` to disown your pet~~
	- ~~Add stuns..~~
		- add smth like \`~bite\` or something to stun..
		- ~~add a \`~stun <id> <time>\` to stun a user~~
		- ~~add \`~unstun <id>\` to unstun~~
		- ~~fix assign cmd~~
		- ~~fix typo on disown cmd~~
`
	)
},}