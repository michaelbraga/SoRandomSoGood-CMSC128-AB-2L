var logger = require('./../utils/logger');
/******************************************************
A function sets the CORS of the
app to allow cross origin stuff
******************************************************/
exports.set = function (app, allowed_origin) {
	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", allowed_origin);
	      res.setHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE");
	      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.send(200);
		}
		else {
			next();
		}
	});
	logger.verbose("CORS: allowed origin: "+ allowed_origin);
}
