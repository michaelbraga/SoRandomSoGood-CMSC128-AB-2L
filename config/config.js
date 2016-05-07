var config = {
	name: 'sogo',
	host: 'localhost',
	port: '3000',
	env: 'development',
	db: {
		prod:{
			host: '$OPENSHIFT_MYSQL_DB_HOST',
			port: '$OPENSHIFT_MYSQL_DB_PORT',
			user	 : 'admingkz7qs4',
			password : '35fMEchL-zUh',
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
