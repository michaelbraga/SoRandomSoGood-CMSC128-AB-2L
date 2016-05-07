var db = require(__dirname + '/../lib/mysql');
var utils = require(__dirname + '/../utils/utils');
var season = require('./../config/config').db.season;
// find all teachers
exports.findAll = function (req, res, next) {
	db.query("SELECT * FROM teacher", function (err, rows) {
		if(err) return next(err);
		res.status(200).send(rows);
	});
}

// remove a teacher in the database
exports.removeOne = function (req, res, next) {
	db.query("DELETE FROM teacher where username = ?", [req.body.username], function (err, rows) {
		if(err) return next(err);
		else if(rows.affectedRows === 0){
			res.status(404).send({message:'Teacher ('+req.body.username+') not found!'});
		}
		else{
			utils.logActivity(req, res, next, rows, 200);
		}
	});
}

// find a specific teacher using `username`
exports.findOne = function (req, res, next) {
	db.query("SELECT * FROM teacher WHERE username = ?", [req.params.username], function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
		}
		else{
			res.status(200).send(rows[0]);
		}
	});
}

// update all information EXCEPT password of one teacher using username
exports.update = function (req, res, next) {
	db.query("UPDATE teacher SET fname = ?, mname = ?, lname = ? where username = ? ",
		   [req.body.fname, req.body.mname, req.body.lname, req.params.username],
	         function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
	});
}

// update colorScheme
exports.changeColorScheme = function (req, res, next) {
	db.query("UPDATE teacher SET colorScheme = ? where username = ? ",
		   [req.body.colorScheme, req.params.username],
	         function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
	});
}

// update the password of one teacher using username
exports.updatePassword = function (req, res, next) {
	db.query("UPDATE teacher SET password = password(sha(?)) where username = ? ",
		   [season.with('salt',season.with('pepper',req.body.password)), req.params.username],
	         function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
	});
}
// update the password of one teacher using username
exports.updateUsername = function (req, res, next) {
	db.query("UPDATE teacher SET username = ? where username = ? ",
		   [req.body.username, req.params.username],
	         function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
			}
			else{
				db.query("SELECT * FROM teacher WHERE username = ?", [req.body.username], function (error, r) {
					if(error) return next(error);
					else if(r.length === 0){
						res.status(404).send({message:'Teacher ('+req.params.username+') not found!'});
					}
					else{
						utils.logActivity(req, res, next, {changedRows:1, data:r[0]}, 200);
					}
				});
			}
	});
}
