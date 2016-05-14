var express = require('express');
var router = express.Router();
var utils = require('./../utils/utils');
var logger = require('./../utils/logger');
/*
	EJS Files to render are in the VIEWS folder
*/

/************************************
 function for checking if logged in
************************************/
function requireLogin(req, res, next) {
	if (!req.session.teacher)
		res.redirect('/login');
	else
		utils.authenticateUser(req, res, next);

}

/**********************************************
	    Anonymous or Guest Routes
**********************************************/
router.get('/', function(req, res, next) {
	if(!req.session || !req.session.teacher)
		res.render('guest/index', {title: 'So Random! So Good!', mode:'index'});
	else
		res.redirect('/teacher');
});
router.get('/randomizer', function(req, res, next) {
	if(!req.session || !req.session.teacher)
		res.render('guest/randomizer', {title: 'SOGO | Randomizer', mode:'randomizer'});
	else
		res.redirect('/teacher');
});
router.get('/about-us', function(req, res, next) {
	if(!req.session || !req.session.teacher)
		res.render('guest/about-us', {title: 'SOGO | About Us', mode:'about-us'});
	else
		res.redirect('/teacher');
});
router.get('/help', function(req, res, next) {
	if(!req.session || !req.session.teacher)
		res.render('guest/help', {title: 'SOGO | About Us', mode:'about-us'});
	else
		res.redirect('/teacher');
});
router.get('/login', function(req, res, next) {
	if(!req.session || !req.session.teacher)
		res.render('guest/login', {title: 'SOGO | Login', mode:'login'});
	else
		res.redirect('/teacher');
});
router.get('/login/:teacher_data', function(req, res, next) {
	var pattern = /\{"username":"[a-zA-Z0-9_\.]{6,30}","password":"[a-zA-Z0-9_\*\.]{8,30}","fname":"[a-zA-Z0-9_\. \t]{6,30}","mname":"[a-zA-Z0-9_\. \t]{6,30}","lname":"[a-zA-Z0-9_\. \t]{6,30}","colorScheme":"[a-zA-Z]{6,30}"\}/
	if (req.session && pattern.test(req.params.teacher_data)) {
		req.session.teacher = JSON.parse(req.params.teacher_data);
		res.redirect('/teacher');
	}
	else{
		res.redirect('/login');
	}

});
router.get('/-u-p/:username', function(req, res, next) {
	req.session.teacher.username = req.params.username.toString();
	res.redirect('/teacher/my-profile');
});
router.get('/-u-p-p/:password', function(req, res, next) {
	req.session.teacher.password = req.params.password.toString();
	res.redirect('/teacher/my-profile');
});
router.get('/logout', function (req, res, next) {
	if (req.session && req.session.teacher) {
		var s = (req.session.teacher.username).toString();
		req.session.destroy(function(err){
			if(err){
				console.log(err);
			} else {
				utils.logActivity(req, res, next, s, 200);
			}
		});
	}
	else{
		res.redirect('/');
	}

});

/**********************************************
	   Registered Teachers Routes
**********************************************/
// DASHBOARD STUFF
router.get('/teacher', requireLogin, function (req, res) {
	res.render('teacher/dashboard', {username: req.session.teacher.username, colorScheme: req.session.teacher.colorScheme, title:('Hello, '+req.session.teacher.fname)});
});
router.get('/teacher/my-profile', requireLogin, function (req, res) {
	res.render('teacher/my-profile/editprofile', {username: req.session.teacher.username, colorScheme: req.session.teacher.colorScheme, title:('Hello, '+req.session.teacher.fname)});
});
router.get('/teacher/help', requireLogin, function (req, res) {
	res.render('teacher/help', {username: req.session.teacher.username, colorScheme: req.session.teacher.colorScheme, title:('Hello, '+req.session.teacher.fname)});
});

/*
@@ FIX
*/
// CLASS STUFF
router.get('/teacher/class/:courseno/:lecturesection$', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'class',
		title: (req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/randomizer/typewriter', toEJS);
});

router.get('/teacher/class/:courseno/:lecturesection/students', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'students',
		title: ("Students | " + req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/students', toEJS);
});

router.get('/teacher/class/:courseno/:lecturesection/add-student', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'add-student',
		title: ("Add a Student | " + req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/add-student', toEJS);
});

router.get('/teacher/class/:courseno/:lecturesection/history', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'history',
		title: ("History | " + req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/history', toEJS);
});

router.get('/teacher/class/:courseno/:lecturesection/randomizer/typewriter', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'typewriter-randomizer',
		title: ("TypeWriter Randomizer | " + req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/randomizer/typewriter', toEJS);
});

router.get('/teacher/class/:courseno/:lecturesection/randomizer/seatplan', requireLogin, function (req, res) {
	var toEJS = {
		username: req.session.teacher.username,
		mode:'seatplan-randomizer',
		title: ("SeatPlan Randomizer | " + req.params.courseno + " " + req.params.lecturesection),
		course: {courseno:req.params.courseno, lecturesection: req.params.lecturesection},
		colorScheme: req.session.teacher.colorScheme
	};

	req.session.class = {courseno:req.params.courseno, lecturesection: req.params.lecturesection};
	res.render('teacher/class/randomizer/seatplan', toEJS);
});
logger.verbose("Routed all public routes");
module.exports = router;
