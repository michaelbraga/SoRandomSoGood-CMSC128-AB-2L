var mysql = require('mysql');
var config = require('./../config/config');
var logger = require('./../utils/logger');

var connectionSettings;
// if (config.mode === 'dev') {
	// connectionSettings = config.db.dev;
// }
// else{
	connectionSettings = config.db.prod;
// }
var db_connection = mysql.createConnection(connectionSettings);
logger.info("Connected to MySQL database at "+connectionSettings.host +" : "+ (connectionSettings.port == null? '':connectionSettings.port));
module.exports = db_connection;
