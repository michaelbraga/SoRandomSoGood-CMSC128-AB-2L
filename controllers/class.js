var db = require(__dirname + '/../lib/mysql');
var utils = require(__dirname + '/../utils/utils');

// find all classes
exports.findAll = function (req, res, next) {
	db.query("SELECT * FROM class", function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}//close select all class

// find all classes of a TEACHER
exports.findAllByTeacher = function (req, res, next) {
	db.query("SELECT * FROM class WHERE tusername = ?", [req.params.tusername], function (err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

// find a specific class of a teacher
exports.findOne = function (req, res, next) {
	db.query("SELECT * FROM class WHERE tusername = ? and courseno = ? and lecturesection = ?",
	[req.params.tusername, req.params.courseno, req.params.lecturesection],
	 function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(404).send({message:'Class ('+req.params.courseno+ " " +req.params.lecturesection+') of '+req.params.tusername+' is not found!'});
		}
		else{
			res.status(200).send(rows[0]);
		}
	});
}//close find specific class

// get number of students in a specific class
exports.getNumberOfStudents = function (req, res, next) {
	db.query("select count(studentno) as no_students from student where courseno = ? and lecturesection = ?", [req.params.courseno, req.params.lecturesection], function (err, rows) {
		if (err) {
			return next (err);
		}
		else {
			res.status(200).send(rows[0]);
		}
	});
}

// insert a class in the database
exports.insert = function (req, res, next) {
	//check missing parameter from request body
	if (!req.body.lecturesection)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: lecturesection'});
	if (!req.body.courseno)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: courseno'});
	if (!req.body.coursename)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: coursename'});
	if (!req.body.room)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: room'});
	if (!req.body.tusername)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: tusername'});
	if (!req.body.no_lrsections)
		return res.status(451).send({'error': true, 'message': 'Missing parameter: no_lrsections'});

	//complete parameters (insert):
	db.query("INSERT INTO class(lecturesection, courseno, coursename, room, tusername, no_lrsections) VALUES (?,?,?,?,?,?)",
		   [req.body.lecturesection, req.body.courseno, req.body.coursename, req.body.room, req.body.tusername, req.body.no_lrsections],
	   	   function (err, rows) {
			if(err) return next(err);
			var newClass = {
				lecturesection:req.body.lecturesection,
				courseno:req.body.courseno,
				coursename:req.body.coursename,
				room:req.body.room,
				tusername:req.body.tusername,
				no_lrsections:req.body.no_lrsections
			};
			utils.logActivity(req, res, next, newClass, 200);
	});
}//close insert

// remove a class in the database
exports.removeOne = function (req, res, next) {
	// remove all students first
	db.query("DELETE FROM student WHERE courseno = ? and lecturesection = ?", [req.params.courseno, req.params.lecturesection],
	function (err, rows) {
		db.query("DELETE FROM class WHERE tusername = ? and courseno = ? and lecturesection = ?",
		[req.params.tusername, req.params.courseno, req.params.lecturesection],
		 function (err, rows) {
			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Class ('+req.body.courseno+ " " +req.body.lecturesection+') of '+req.body.tusername+' is not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
		});
	});

}//close remove class

// update a class
exports.update = function (req, res, next) {

	// update all students first

	db.query("UPDATE class SET lecturesection = ?, no_lrsections = ?, courseno = ?, coursename = ?, room = ? WHERE tusername = ? and courseno = ? and lecturesection = ?",
	[req.body.lecturesection, req.body.no_lrsections, req.body.courseno, req.body.coursename, req.body.room, req.params.tusername, req.params.courseno, req.params.lecturesection],
	         function (err, rows) {

			if(err) return next(err);
			else if(rows.affectedRows === 0){
				res.status(404).send({message:'Class ('+req.params.courseno+ " " +req.params.lecturesection+') of '+req.params.tusername+' is not found!'});
			}
			else{
				utils.logActivity(req, res, next, rows, 200);
			}
	});

}//close update class
