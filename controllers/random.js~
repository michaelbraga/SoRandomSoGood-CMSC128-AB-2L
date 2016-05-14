
var db = require(__dirname + '/../lib/mysql');

/*
	function to be called for randomizing students according to the specified filters
*/

exports.randomizeStudent = function(req, res, next){
	var N = req.params.n;
	var section = req.params.section;
	var sex = req.params.sex;
	var batch = req.params.batch;
	var college = req.params.college;
	var degreeProgram = req.params.degreeProgram;
	var courseno = req.params.courseno;
	var lecturesection = req.params.lecturesection;

	var where = "SELECT * from student WHERE ";
	where += "courseno = '" + courseno+ "' AND ";
	where += "lecturesection = '" + lecturesection + "' AND ";
	if(section!="none") where += "lrsection = '" + section + "' AND ";
	//else where += "lrsection LIKE '%%' AND ";
	if(sex!="none") where += "sex = '" + sex + "' AND ";
	else where += "sex LIKE '%%' AND ";
	if(batch!="none") where += "studentno LIKE '" + batch + "%' AND ";
	else where += "studentno LIKE '%%' AND ";
	if(college!="none") where += "college = '" + college + "' AND ";
	else where += "college LIKE '%%' AND ";
	if(degreeProgram!="none") where += "degcourse = '" + degreeProgram + "' ";
	else where += "degcourse LIKE '%%' ";
	where = where + "ORDER BY RAND() LIMIT " + N + ";";
	db.query(where ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});

}

/*
	function to be executed when the user added students in risk and safe zone
 	the function will randomized students depending on the value of their priority
*/

exports.getAcc = function(req, res, next){
	db.query("(select * from student where priority = 1 and courseno=? and lecturesection=? ORDER BY RAND() LIMIT ?) UNION (select * from student where priority = 0 and courseno=? and lecturesection=? ORDER BY RAND() LIMIT ?);", [req.params.courseno, req.params.lecturesection, parseInt(req.params.N), req.params.courseno, req.params.lecturesection, parseInt(req.params.nRemaining)], function(err, rows) {
		if(err){
			return (err);
		}
		res.status(200).send(rows);
	});
}

/*
	function for getting the recit or lab section in the specified lecture section
*/

exports.getLrSections = function(req, res, next){
	db.query("SELECT DISTINCT lrsection FROM student WHERE courseno=? AND lecturesection=? AND lrsection is not null ORDER BY lrsection;", [req.params.courseno, req.params.lecturesection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

/*
	function for gettiing the students in a recit section
*/

exports.getStudentsByLrSection = function(req, res, next){
	db.query("SELECT * from student WHERE courseno=? AND lecturesection=? and lrsection=?;", [req.params.courseno, req.params.lecturesection, req.params.lrsection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

/*
	function for setting the priority of a student to be used for randomization
*/

exports.updatePriority = function(req, res, next){
	db.query("update student set priority = ? where studentno=? and courseno = ? and lecturesection=? and lrsection = ?;", [req.params.p, req.params.studentno, req.params.courseno, req.params.lecturesection, req.params.lrsection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

/* function for getting all students */

exports.randomizeee = function(req, res, next){
	db.query("SELECT * FROM student;" ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

/*
	function for adding logs per randomization of students
*/

exports.addLog = function (req, res, next) {
	db.query("INSERT INTO log(logdate, courseno, lecturesection, studentno) VALUES(NOW(),?,?,?)", [req.body.courseno, req.body.lecturesection, req.body.studentno], function (err, rows) {
		if(err) return next(err);
		res.status(200).send(rows);
	});
}
