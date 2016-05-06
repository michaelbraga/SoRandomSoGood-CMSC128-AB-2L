var db = require(__dirname + '/../lib/mysql');

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

exports.getOne = function(req, res, next){
	db.query("SELECT * FROM student ORDER BY RAND() LIMIT 1;" ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.getOneAccName = function(req, res, next){
	var fname = req.params.fname;
	var mname = req.params.mname;
	var lname = req.params.lname;

	var where = "SELECT * from student WHERE ";

	if(fname!="none") where += "fname = '" + fname + "' AND ";
	else where += "fname LIKE '%%' AND ";
	if(mname!="none") where += "mname = '" + mname + "' AND ";
	else where += "mname LIKE '%%' AND ";
	if(lname!="none") where += "lname = '" + lname + "' ";
	else where += "lname LIKE '%%' ";
	where = where + "LIMIT 1;";
	db.query(where ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.getLrSections = function(req, res, next){
	db.query("SELECT DISTINCT lrsection FROM student WHERE courseno=? AND lecturesection=? AND lrsection is not null ORDER BY lrsection;", [req.params.courseno, req.params.lecturesection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.getStudentsByLrSection = function(req, res, next){
	db.query("SELECT * from student WHERE courseno=? AND lecturesection=? and lrsection=?;", [req.params.courseno, req.params.lecturesection, req.params.lrsection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.randomizeee = function(req, res, next){
	db.query("SELECT * FROM student;" ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}
var db = require(__dirname + '/../lib/mysql');

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

exports.getAcc = function(req, res, next){
	db.query("(select * from student where priority = 1 and courseno=? and lecturesection=? ORDER BY RAND() LIMIT ?) UNION (select * from student where priority = 0 and courseno=? and lecturesection=? ORDER BY RAND() LIMIT ?);", [req.params.courseno, req.params.lecturesection, parseInt(req.params.N), req.params.courseno, req.params.lecturesection, parseInt(req.params.nRemaining)], function(err, rows) {
		if(err){
			return (err);
		}
		res.status(200).send(rows);
	});
}

exports.getLrSections = function(req, res, next){
	db.query("SELECT DISTINCT lrsection FROM student WHERE courseno=? AND lecturesection=? AND lrsection is not null ORDER BY lrsection;", [req.params.courseno, req.params.lecturesection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.getStudentsByLrSection = function(req, res, next){
	db.query("SELECT * from student WHERE courseno=? AND lecturesection=? and lrsection=?;", [req.params.courseno, req.params.lecturesection, req.params.lrsection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.updatePriority = function(req, res, next){
	db.query("update student set priority = ? where studentno=? and courseno = ? and lecturesection=? and lrsection = ?;", [req.params.p, req.params.studentno, req.params.courseno, req.params.lecturesection, req.params.lrsection], function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.randomizeee = function(req, res, next){
	db.query("SELECT * FROM student;" ,function(err, rows) {
		if(err) return (err);
		res.status(200).send(rows);
	});
}

exports.addLog = function (req, res, next) {
	db.query("INSERT INTO log(logdate, courseno, lecturesection, studentno) VALUES(NOW(),?,?,?)", [req.body.courseno, req.body.lecturesection, req.body.studentno], function (err, rows) {
		if(err) return next(err);
		res.status(200).send(rows);
	});
}
