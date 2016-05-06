var db = require(__dirname + '/../lib/mysql');
var utils = require(__dirname + '/../utils/utils');
var season = require('./../config/config').db.season;

// login user
exports.login = function (req, res, next) {
	db.query("SELECT username, password, fname, mname, lname, colorScheme, password(sha(?)) as pass FROM teacher WHERE username = ?",[( season.with('pepper', season.with('salt', req.params.password)) ),req.params.username], function (err, rows) {
		if(err){
			res.status(500).send({status:'failure', message:'Database server is down :( Try again later!', rrore:err});
		}
		else if(rows.length === 0){
			res.status(404).send({status:'failure', message:'Username ('+req.params.username+') does not exist!'});
		}
		else{
			if(rows[0].pass !== rows[0].password){
				res.status(401).send({status:'failure', message:'Password entered for ('+req.params.username+') is invalid!'});
			}
			else{
				/**********************************
				*	Create session for user	    *
				**********************************/
				req.session.teacher = rows[0];
				utils.logActivity(req, res, next, {status:'success', data:rows[0], session:req.session}, 200);
			}
		}
	});
}

// sign up a teacher in the database
exports.signup = function (req, res, next) {
	db.query("INSERT INTO teacher(username, password, fname, mname, lname) VALUES (?,password(sha(?)),?,?,?)",
		   [req.body.username, ( season.with('pepper', season.with('salt', req.body.password)) ), req.body.fname, req.body.mname, req.body.lname],
	   	   function (err, rows) {
			if(err) return next(err);
			var newTeacher = {
				username:req.body.username,
				password:req.body.password,
				fname:req.body.fname,
				mname:req.body.mname,
				lname:req.body.lname
			};
			utils.logActivity(req, res, next, {status:'success', data:newTeacher}, 200);
	});
}
