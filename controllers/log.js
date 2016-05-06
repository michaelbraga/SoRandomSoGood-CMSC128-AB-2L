var db = require(__dirname + '/../lib/mysql');

// find all logs
exports.findAll = function (req, res, next) {
	db.query("SELECT * FROM log", function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// find all logs in a class
exports.findAllByClass = function (req, res, next) {
	db.query("SELECT * FROM log natural join student WHERE courseno = ? and lecturesection = ?",[req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// insert a logs
exports.insert = function (req, res, next) {
	db.query("INSERT INTO log(logdate, courseno, lecturesection, studentno) VALUES(NOW(),?,?,?)",
	[req.body.courseno, req.body.lecturesection, req.body.studentno]
	, function (err, rows) {
		if(err) return next(err);
		var newLog = {
			courseno:req.body.courseno,
			lecturesection:req.body.lecturesection,
			studentno:req.body.studentno
		};
		res.status(200).send(newLog);
	});
}

// delete all logs in a class
// if we delete a class, we delete all its logs
exports.removeAllByClass = function (req, res, next) {
	db.query("DELETE FROM log WHERE courseno = ? and lecturesection = ?",[req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// delete a specific log
exports.removeOne = function (req, res, next) {
	db.query("DELETE FROM log WHERE logid = ?, courseno = ? and lecturesection = ?",[req.body.logid, req.body.courseno, req.body.lecturesection], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}
