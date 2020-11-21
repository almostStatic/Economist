module.exports={name:'todo',aliases:['todo'],
category: 'own',descrption:"see the bot owner's to do list...",async run(client,message,args){
	return message.channel.send(
`
    - Transfer data command from one user directly to another (\`~datatransfer <source> <destination user>\`)
`
	)
},}