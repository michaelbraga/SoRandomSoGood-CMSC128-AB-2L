var teacher = require('./../controllers/teacher');
var _class = require('./../controllers/class'); // `_class` kasi bawal ang `class`
var student = require('./../controllers/student');
var log = require('./../controllers/log');
var guest = require('./../controllers/guest');
var utils = require('./../utils/utils');
var rand = require('./../controllers/random');
var logger = require('./../utils/logger');

/******************************************************************
    This function is a middleware that checks if there is an
    existing session of a teacher/user.
******************************************************************/
function authorizeUser(req, res, next) {
	if (!req.session || !req.session.teacher)
		res.status(401).send({message:'Unauthorized access to database!'});
	else
		utils.authenticateUser(req, res, next);
}

module.exports = function (router) {
	// /*------------------------------------------------------------------------
	// 	For guests
	// ------------------------------------------------------------------------*/
	router.route('/api-guest/login/:username/:password')
		.get(guest.login);
	router.route('/api-guest/signup')
		.post(guest.signup);

	/*------------------------------------------------------------------------
		For logged in users
	------------------------------------------------------------------------*/
	/*************************************************************
	  Route for requesting the username of the LOGGED IN teacher
	*************************************************************/
	router.route('/api-user/teacher-username')
		.get(authorizeUser, function (req, res, next) {
			res.status(200).send({username:req.session.teacher.username});
		});

	/****************************
		    TEACHER
	****************************/
	router.route('/api-user/teacher')
		.get(authorizeUser, teacher.findAll)
		.delete(authorizeUser, teacher.removeOne);
	router.route('/api-user/teacher/:username')
		.get(authorizeUser, teacher.findOne)
		.put(authorizeUser, teacher.update);
	router.route('/api-user/teacher-password/:username')
		.put(authorizeUser, teacher.updatePassword);
	router.route('/api-user/teacher-username/:username')
		.put(authorizeUser, teacher.updateUsername);
	router.route('/api-user/teacher-color/:username')
		.put(authorizeUser, teacher.changeColorScheme);

	/****************************
		     CLASS
	****************************/
	router.route('/api-user/class')
		.get(authorizeUser, _class.findAll)
		.post(authorizeUser, _class.insert);
	router.route('/api-user/class/:tusername/:courseno/:lecturesection')
		.get(authorizeUser, _class.findOne)
		.put(authorizeUser, _class.update)
		.delete(authorizeUser, _class.removeOne);
	router.route('/api-user/class-teacher/:tusername')
		.get(authorizeUser, _class.findAllByTeacher);
	router.route('/api-user/number-of-students/:courseno/:lecturesection')
		.get(authorizeUser, _class.getNumberOfStudents);
	/****************************
		    STUDENT
	****************************/
	router.route('/api-user/student')
		.get(authorizeUser, student.findAll)
		.post(authorizeUser, student.insert);
	router.route('/api-user/student-class/:courseno/:lecturesection/')
		.get(authorizeUser, student.findAllByClass)
		.delete(authorizeUser, student.removeAllByClass);
	router.route('/api-user/student-section/:courseno/:lecturesection/:lrsection')
		.get(authorizeUser, student.findAllBySection);
	router.route('/api-user/student/:studentno/:courseno/:lecturesection')
		.get(authorizeUser, student.findOne)
		.put(authorizeUser, student.update)
		.delete(authorizeUser, student.removeOne);
	router.route('/api-user/student-picture/:studentno/:courseno/:lecturesection')
		.get(authorizeUser, student.findOnePicture);
	router.route('/api-user/student-name/:studentno/:courseno/:lecturesection')
		.get(authorizeUser, student.findOneFullName);
	router.route('/api-user/randomizeSeat/:n/:courseno/:lecturesection')
		.get(authorizeUser, student.randomizeSeat);

	/****************************
	           LOG
	****************************/
	router.route('/api-user/log')
		.get(authorizeUser, log.findAll)
		.post(authorizeUser, log.insert)
		.delete(authorizeUser, log.removeOne);
	router.route('/api-user/log/:courseno/:lecturesection')
		.delete(authorizeUser, log.removeAllByClass)
		.get(authorizeUser, log.findAllByClass);

	/****************************
	           RANDOMIZER
	****************************/
	router.route('/api-user/randomize')
		.get(authorizeUser, rand.randomizeee);
	router.route('/api-user/randomize/:n/:section/:sex/:batch/:college/:degreeProgram/:courseno/:lecturesection')
		.get(authorizeUser, rand.randomizeStudent);
	router.route('/api-user/buro/:courseno/:lecturesection/:N/:nRemaining')
		.get(authorizeUser, rand.getAcc);
	router.route('/api-user/lrsection/:courseno/:lecturesection')
		.get(authorizeUser, rand.getLrSections);
	router.route('/api-user/lrsection/:courseno/:lecturesection/:lrsection')
		.get(authorizeUser, rand.getStudentsByLrSection);
	router.route('/api-user/buro/:courseno/:lecturesection/:lrsection/:studentno/:p')
		.put(authorizeUser, rand.updatePriority);
	router.route('/api-user/randLog')
		.post(authorizeUser, rand.addLog);

	router.all('/api-user/*', function (req, res, next) {
		res.status(404).send({message : 'Nothing to do here.'});
	});
	logger.verbose("Routed all database api routes");
	return router;
};
