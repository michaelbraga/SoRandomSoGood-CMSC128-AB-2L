var db = require(__dirname + '/../lib/mysql');
var utils = require(__dirname + '/../utils/utils');

/*
	CLASS = courseno + lecturesection
*/
// find ALL students
exports.findAll = function (req, res, next) {
	db.query("SELECT * FROM student", function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// find ALL students in a specific CLASS
// ex: all students from CMSC 128 AB
exports.findAllByClass = function (req, res, next) {
	db.query("SELECT * FROM student WHERE courseno = ? and lecturesection = ?", [req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// find ALL students in a specific LAB or RECIT Section in a specific CLASS
// ex: all students from CMSC 128 AB 2L
exports.findAllBySection = function (req, res, next) {
	db.query("SELECT * FROM student WHERE courseno = ? and lecturesection = ? and lrsection = ?", [req.params.courseno, req.params.lecturesection, req.params.lrsection], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// find a specific student using STUDENTNO, COURSENO, LECTURESECTION
exports.findOne = function (req, res, next) {
	db.query("SELECT * FROM student WHERE studentno = ? and courseno = ? and lecturesection = ?", [req.params.studentno, req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(404).send({message:'Student ('+req.params.studentno+') from '+req.params.courseno+" "+req.params.lecturesection+' is not found!'});
		}
		else{
			res.status(200).send(rows[0]);
		}
	});
}

// find specific student's picture using STUDENTNO, COURSENO, LECTURESECTION
exports.findOnePicture = function (req, res, next) {
	db.query("SELECT picture FROM student WHERE studentno = ? AND courseno = ? AND lecturesection = ?", [req.params.studentno, req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(404).send({message:'Student ('+req.params.studentno+') from '+req.params.courseno+" "+req.params.lecturesection+' is not found!'});
		}
		else{
			res.status(200).send(rows[0]);
		}
	});
};

// find specific student's fullname using STUDENTNO, COURSENO, LECTURESECTION
exports.findOneFullName = function (req, res, next) {
	db.query("SELECT fname, mname, lname FROM student WHERE studentno = ? and courseno = ? and lecturesection = ?", [req.params.studentno, req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(404).send({message:'Student ('+req.params.studentno+') from '+req.params.courseno+" "+req.params.lecturesection+' is not found!'});
		}
		else{
			res.status(200).send(rows[0]);
		}
	});
};

// insert a student to a CLASS in the database
exports.insert = function (req, res, next) {
	db.query("INSERT INTO student(studentno, fname, mname, lname, degcourse, college, sex, seatno, courseno, lecturesection, lrsection, picture, priority) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
		   [req.body.studentno, req.body.fname, req.body.mname, req.body.lname, req.body.degcourse, req.body.college, req.body.sex, req.body.seatno, req.body.courseno, req.body.lecturesection, req.body.lrsection, req.body.picture, 0],
	   	   function (err, rows) {
			if(err) return next(err);
			var newStudent = {
				studentno:req.body.studentno,
				fname:req.body.fname,
				mname:req.body.mname,
				lname:req.body.lname,
				degcourse:req.body.degcourse,
				college:req.body.college,
				sex:req.body.sex,
				picture:req.body.picture,
				seatno:req.body.seatno,
				courseno:req.body.courseno,
				lecturesection:req.body.lecturesection,
				lrsection:req.body.lrsection,
				priority:0
			};
			utils.logActivity(req, res, next, newStudent, 200);
	});
}

// remove a Student in the database using STUDENTNO, COURSENO, LECTURESECTION
exports.removeOne = function (req, res, next) {
	db.query("SET FOREIGN_KEY_CHECKS = 0");
	db.query("DELETE FROM student WHERE studentno = ? and courseno = ? and lecturesection = ?", [req.params.studentno, req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return next(err);
		else if(rows.affectedRows === 0){
			res.status(404).send({message:'Student ('+req.body.studentno+') from '+req.body.courseno+" "+req.body.lecturesection+' is not found!'});
		}
		else{
			utils.logActivity(req, res, next, rows, 200);
		}
	});
	db.query("SET FOREIGN_KEY_CHECKS = 1");
}

// remove all student that belongs to a certain class in the database using STUDENTNO, COURSENO, LECTURESECTION
exports.removeAllByClass = function (req, res, next) {

	db.query("DELETE FROM student WHERE courseno = ? and lecturesection = ?", [req.params.courseno, req.params.lecturesection], function (err, rows) {
		if(err) return next(err);
		res.status(200).send(rows);
	});
}

// update all information EXCEPT courseno and lecturesection of one student using STUDENTNO, COURSENO, LECTURESECTION
exports.update = function (req, res, next) {
	db.query("SET FOREIGN_KEY_CHECKS = 0");
	db.query("UPDATE student SET studentno = ?, fname = ?, mname = ?, lname = ?, degcourse = ?, college = ?, sex = ?, picture = ?, seatno = ?, lrsection = ? WHERE studentno = ? and courseno = ? and lecturesection = ?",
		[req.body.studentno, req.body.fname, req.body.mname, req.body.lname, req.body.degcourse, req.body.college, req.body.sex, req.body.picture, req.body.seatno, req.body.lrsection, req.params.studentno, req.params.courseno, req.params.lecturesection],
	         function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Student ('+req.params.studentno+') from '+req.params.courseno+" "+req.params.lecturesection+' is not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
	});
	db.query("SET FOREIGN_KEY_CHECKS = 1");
}

exports.randomizeSeat = function(req, res, next){
	db.query("select * from student where courseno=? and lecturesection=? ORDER BY RAND() LIMIT ?;", [req.params.courseno, req.params.lecturesection, parseInt(req.params.n)], function(err, rows) {
		if(err){
			return (err);
		}
		res.status(200).send(rows);
	});
}
