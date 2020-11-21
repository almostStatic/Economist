const config = {
	functions: {
		/**
		 * Shows element in inspcted format 
		 * @param {any} element Element to be inspected 
		 * @param {number} penetrate How deep to penetrate through element
		 */
		Inspect: function (element, penetrate) {
			return require("util").inspect(element, { depth: isNaN(penetrate) ? 1000000000000000000000000 : Number(penetrate) });
		}, 
		/**
		 * Extracts the ID of a mentioned user from its raw content 
		 * @param {string} mention String to extract mention ID from
		 */
		getID: function (mention) {
			if (!mention) return;
			const matches = mention.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			const id = matches[1];
			return id;			
		},
		/**
		 * Inserts comma to a string; acts as a thousands separator 
		 * @param {string} x String to add the commas to 
		 */
		comma: function (x) {
			if (!x) return;
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		format: function(Balance) {
			let formatted;
			if (Balance.toString().toLowerCase().includes("e")) {
				let split = Balance.split("e");
				formatted = split[0].replace(".", '') + '0'.repeat(Number(split[1]))
			} else {
				formatted = Balance;
			};
			return formatted;
		},
		/**
		 * Applies digit trimming to a `str` instance
		 * @param {string} str String to show digits; may be NaN
		 * @param {?number} sliceAt Position at which to end the `str` and show remaining digits
		 */
		digits: function(str, sliceAt = 15) {
			str = str.toString();
			sliceAt = parseInt(sliceAt)
			let Return;
			if (str.length > sliceAt) {
				Return = str.slice(0, sliceAt);
				return `${Return}... (${str.length - 10} trimmed digits)`
			} else {
				return str;
			}
		},		
		/**
		 * This function will add hyphens to a string every X characters; view [the article type thingy](https://repl.it/talk/share/Insert-Hyphens-in-JavaScript-String/50244) for additional information.
		 * @param {string} str The string to hyphenify
		 * @param {number} interval The interval of which to add hyphens to the string 
		 * @param {object} options Options to be applied.
		 * @returns {string} String<hyphenified> Hyphenified String
		 */
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
			if (typeof options !== 'object') {
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
		/**
		 * Removes the exponent ("E") on numbers expressed in scientific notation
		 * @returns Returns the number, expressed in its extended form
		 */
		noExponents: function (x) {
    var data = String(x).split(/[eE]/);
    if (data.length == 1) return data[0]; 

    let z = '';
		let sign = x < 0 ? '-' : '';
    let str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while (mag--) z += '0';
    return str + z;
		},
	},
	config: {
		maxedPet: '99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999;99999999999999999',
		inv: "https://discord.com/oauth2/authorize?client_id=671708767813107724&scope=bot&permissions=67456065",
		prefix: '~',
		defaultHexColor: "#00aaaa",
		ssInvite: "https://discord.gg/5Rsytp3",
		supportServer: "706845688969035897",//ID 
		goodFriends: ['501710994293129216', '301855763226165248', '580358240014172181', '437255943181565962',
	'530606911326912522', 
		'315311485738024960', "676123066165624866"],
		owner: '501710994293129216',
		x: 1594726151239,//last time rules were updated
    maxLvl: 100,
    boostPay: "5000",
		channels: {
			bug: '723558118780567642',
			general: "706845689413369907",
			ready: "706845762117566514",
			reconnecting: "706845762117566514",
			error: "706845999418572809",
			rateLimit: "706846302561894521",
			guildLogs: "706846016279805963",
			memberLog: "756140567037083718",
			modlog: "719912989184229458",
			"set": "758440276548911174",
			suggestions: '758598514623643690',
			msgLogs: "759422052783358013",
      boostAnnCh: "760284069124243487"
		},
		roles: {
			judge: '734418846865424424',
			businessman: "728236365183188993",
			updates: '722475705056624690',
      boostRole: "760248449525350401",
			db: '719604560607314001',
			nerd: '706928601936953477',
			civilian: "706847072510541895",
			admin: "706848985628803093",
			mod: { trial: "706848893823877211", normal: "706848940225462323" },
			rebel: "706847641257902083",
			sarg: "706847738813218819",
			staff: "706847178978623499",
			cit: "706847119620702279",
      blacklistedRole: "759646469379981354",
			col: '706848486716342342', //add col to list
			supreme: '706848033416937502',
			warrior: '706847680101351506',
			human: '706846887558512671',
			memberRole: "706846887558512671",
			muted: '706847237245894656',
			civ: '706847072510541895',
			botDeveloper: "757885305184583720"
		},
		/**
		 * All the emojis which are to be used by the client 
		 */
		emoji: {
			tick: '<:tick:717750818132197387>',
			err: '<:red:717752995135225886>',
			fishing_rod: '<:fishing_rod:717045864643821599>',
			mobile_phone: ':iphone:',
			phonebook: ':book:',
			chill: '<:chillpill:722828409331253349>',
			loading: "<a:loading:771089335025532948>"
		},
		colors: {
			green: '#4bc46b',
			red: '#f56c6c',
		},
		indexes: {
			botDeveloper: 0, 
			businessman: 1, 
			colorist: 2,
			dbmanager: 3,
			judge: 4,
			nerd: 5,
			rebel: 6,
			sarg: 7,
			staff: 8,
			supreme: 9,
			updates: 10,
			warrior: 11
		},
	},	
};

config.config.items = {
	reb: {
		role: config.config.roles.rebel,
		price: 25,
		name: "rebel"
	},
	sarg: {
		role: config.config.roles.sarg,
		price: 100,
		name: "sargent"
	},	
	jud: {
		role: config.config.roles.judge,
		price: 150,
		name: "judge"
	},	
	ner: {
		role: config.config.roles.nerd,
		price: 150,
		name: "nerd"
	},	
	civ: {
		role: config.config.roles.civilian,
		price: 300,
		name: "civilian"
	},	
	cit: {
		role: config.config.roles.cit,
		price: 1_000,
		name: "citizen"
	},	
	col: {
		role: config.config.roles.col,
		price: 350,
		name: "colorist"
	},	
	sup: {
		role: config.config.roles.supreme,
		price: 1_250,
		name: "supreme"
	},	
	war: {
		role: config.config.roles.warrior,
		price: 1010,
		name: "warrior"
	},	
	muted: {
		role: config.config.roles.muted,
		price: 1_000_000_000,
		name: "muted"
	},	
}

module.exports = config;
