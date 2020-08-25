const config = {
	functions: {
		getID: function (mention) {
			if (!mention) return;
			const matches = mention.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			const id = matches[1];
			return id;			
		},
		comma: function (x) {
			if (!x) return;
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		hyphen: function (str, interval, options) {
			if (!options) {
				options = {
					/**
					 * Whether or not to reomve whitespaces from the string 
					 */
					removeWhiteSpaces: true,
					/**
					 * Whether or not to inc new line
					 */
					includeNewLine: false
				};
			};
			if (typeof options != 'object') {
				throw new TypeError("options must be of type object");
			};
			if (!str) return null;
			if (!interval) {
				interval = 1;
			};
			interval = Number(interval);
			str = str.toString();
			if (options.removeWhiteSpaces) {
				//remove whitespaces: 
				str = str.replace(/ +/g, '');
			};
			let matches;
			if (options.includeNewLine) {
				matches = str.match(new RegExp('.{1,' + interval + '}', 'gs')); 
			} else {
				matches = str.match(new RegExp('.{1,' + interval + '}', 'g')); 
			};
			if (!matches) return null;
			return matches.join('-');
		},		
		/**
		 * Calculates the cooldown and returns `hrs` and `mins`
		 * @param {Date} lastUsed Last time the command was used 
		 * @param {Date} now on which date this cooldown should be calculated on 
		 * @param {Number} cdAmt The amount of the cooldown
		 * @returns {Object} hrs: Number, mins: Number
		 */
		cooldown: function (lastUsed, now, cdAmt) {
			if (isNaN(lastUsed)) return;
			if (isNaN(now)) return;
			if (isNaN(cdAmt)) return;
			lastUsed = Number(lastUsed);
			now = Number(now);
			cdAmt = Number(cdAmt);
			let expirationTime = lastUsed + cdAmt;
			if (now < expirationTime) {
				let mins = new Date(expirationTime - now).getMinutes();
				let hrs = new Date(expirationTime - now).getHours();
				return {
					hrs: hrs,
					mins: mins,
				};
			} else {
				return;
			}
		},
	},
	config: {
		inv: "https://discord.com/oauth2/authorize?client_id=671708767813107724&scope=bot&permissions=67456001",
		prefix: '~',
		defaultHexColor: "#00aaaa",
		ssInvite: "https://discord.gg/bpTQkt",
		supportServer: "706845688969035897",//ID 
		goodFriends: ['501710994293129216', '301855763226165248', '580358240014172181', '437255943181565962',
	'530606911326912522', 
		'315311485738024960', "676123066165624866"],
		owner: '501710994293129216',
		x: 1594726151239,//last time rules were updated
		channels: {
			bug: '723558118780567642',
			general: "706845689413369907",
			ready: "706845762117566514",
			reconnecting: "706845762117566514",
			error: "706845999418572809",
			rateLimit: "706846302561894521",
			guildLogs: "706846016279805963",
			memberLog: "706846783556288542",
			modlog: "719912989184229458",
		},
		roles: {
			judge: '734418846865424424',
			businessman: "728236365183188993",
			updates: '722475705056624690',
			db: '719604560607314001',
			nerd: '706928601936953477',
			civilian: "706847072510541895",
			admin: "706848985628803093",
			mod: { trial: "706848893823877211", normal: "706848940225462323" },
			rebel: "706847641257902083",
			sarg: "706847738813218819",
			staff: "706847178978623499",
			cit: "706847119620702279",
			col: '706848486716342342', //add col to list
			supreme: '706848033416937502',
			warrior: '706847680101351506',
			human: '706846887558512671',
			memberRole: "706846887558512671",
			muted: '706847237245894656',
		},
		emoji: {
			tick: '<:tick:717750818132197387>',
			err: '<:red:717752995135225886>',
			fishing_rod: '<:fishing_rod:717045864643821599>',
			mobile_phone: ':iphone:',
			phonebook: ':book:',
			chill: '<:chillpill:722828409331253349>',
		},
		colors: {
			green: '#4bc46b',
			red: '#f56c6c',
		},
	},	
};

module.exports = config;