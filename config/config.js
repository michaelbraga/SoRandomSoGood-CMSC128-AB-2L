var config = {
	name: 'sogo',
	host: 'localhost',
	port: '3000',
	env: 'production',
	db: {
		prod:{
			host: 'cmsc128-ab-2l-seoul.chpejxdwz6ao.ap-northeast-2.rds.amazonaws.com',
			port: 3306,
			user	 : 'mastersogokorea',
			password : 'sogolicious',
			database : 'sogo'
		},
		dev:{
			host	: 'localhost',
			user	: 'sogo_user',
			password: 'sogolicious',
			database: 'sogo',
		},
		season:{
			with: function (seasoning, word) {
				switch (seasoning) {
					case 'salt': return ('4s1np4m0r3' + word);
							break;
					case 'pepper': return (word + 'p4m1nt4p4m0r3');
							break;
					default: return null;

				}
			}
		}
	}
};

module.exports = config;
