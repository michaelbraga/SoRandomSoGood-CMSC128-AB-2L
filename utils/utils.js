var db = require('./../lib/mysql');

/******************************************************
A function that checks the current logged
in user in the database and updates the session
for the user.
******************************************************/
exports.authenticateUser = function (req, res, next) {
	if (!req.session || !req.session.teacher) {
		res.status(401).send({message: ('Unauthorized to access the database!')});
	}

	db.query("SELECT * FROM teacher WHERE username = ? and password = ? ",[req.session.teacher.username, req.session.teacher.password], function (err, rows) {
		if(err) return next(err);
		else if(rows.length === 0){
			res.status(401).send({message: (req.session.teacher.username +' is not authorized to access the database!')});
		}
		else{
			req.session.teacher = rows[0];
			next();
		}
	});
}

/******************************************************
A function that logs the activities of a user and
stores it in the database
******************************************************/
exports.logActivity = function (req, res, next, to_send, stat) {
	var teacher = null;
	if (req.session && req.session.teacher) {
		teacher = req.session.teacher;
	}
	var log = {
		activity:'',
		user:(teacher == null)? '':teacher.username ,
		ip_address:req.connection.remoteAddress
	}, logout = false;

	// filter requests by http method and analyze activity
	switch (req.method) {
		case 'GET': if (/^\/api-guest\/login\/.+\/.+$/.test(req.url)) {
					log.activity = "Logged in";
				}
				else if (req.url == '/logout') {
					log.activity = "Logged out";
					log.user = to_send;
					logout = true;
				}
			break;

		case 'POST': if (req.url == "/api-guest/signup") {
					log.activity = "Created an account";
					log.user = req.body.username;
				}
				else if (req.url == "/api-user/class") {
					log.activity = "Added class " + req.body.courseno+" "+req.body.lecturesection;
				}
				else if (req.url == "/api-user/student") {
					log.activity = "Added student " +req.body.studentno+" in class "+ req.body.courseno+" "+req.body.lecturesection;
				}
			break;

		case 'PUT': if (/^\/api-user\/teacher\/.+$/.test(req.url)) {
					log.activity = "Updated profile information";
				}
				else if (/^\/api-user\/teacher-password\/.+$/.test(req.url)) {
					log.activity = "Updated password";
				}
				else if (/^\/api-user\/teacher-color\/.+$/.test(req.url)) {
					log.activity = "Updated color scheme";
				}
				else if(/^\/api-user\/class\/.+\/.+\/.+$/.test(req.url)){
					log.activity = "Updated class " + req.body.courseno+" "+req.body.lecturesection;
				}
				else if (/^\/api-user\/student\/.+\/.+\/.+$/.test(req.url)) {
					log.activity = "Updated student " + req.params.studentno + " in class " + req.params.courseno+" "+req.params.lecturesection;
				}
			break;

		case 'DELETE': if (req.url == "/api-user/teacher") {
					log.activity = "Deleted user";
				}
				else if(/^\/api-user\/class\/.+\/.+\/.+$/.test(req.url)){
					log.activity = "Deleted class " + req.params.courseno+" "+req.params.lecturesection;
				}
				else if (/^\/api-user\/student\/.+\/.+\/.+\/$/.test(req.url)) {
						log.activity = "Deleted student " + req.params.studentno + " in class " + req.params.courseno+" "+req.params.lecturesection;
				}
			break;
		default:

	}

	// insert log in the database
	db.query("insert into user_activity_log (activity, user, ip_address) values (?, ?, ?)", [log.activity, log.user, log.ip_address], function (err, rows) {
		if (err) next(err);
		if (logout) res.status(stat).redirect('/login');
		else res.status(stat).send(to_send);
	});


}
