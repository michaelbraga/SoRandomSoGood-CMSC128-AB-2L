'use strict';
(function () {
	/* Teacher App */
	angular
	.module("TeacherApp")
	/* Teacher Service Provider */
	.factory("TeacherService", TeacherService);

	/* Inject Dependencies for TeacherService */
	TeacherService.$inject = ["$http", "$q"];
	// $http - for http requests
	// $q - for asynchronous functions

	function TeacherService($http, $q) {
		var url = document.location.origin + "/api-user";
		var service = {};

		/* SERVICES */
		function GetUsername() {
			return (($('#sogousername').html().trim()));
		}


		/* Team Von Neumann */
		// Zydrick
		// 1 GetAllClasses(username)
		// - get all class(es) that belong(s) to teacher 'username'
		function GetAllClasses(username) {
			var deferred = $q.defer();
			var completeUrl = [url, "class-teacher", username];

			$http.get(completeUrl.join('/'))
			.success(function (data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		// Angec
		// 2 GetAllStudentsInClass(courseno, lecturesection)
		// - get all students in a specific class(courseno, lecturesection) that belongs to teacher 'username'
		// - Get all students in a specific lab/recit section in a class
		function GetAllStudentsInClass(courseno, lecturesection){
			var deferred = $q.defer(); //expose promise
			var completeUrl = url + "/student-class/"+courseno+"/"+lecturesection;

			$http.get(completeUrl)
			.success(function(data){
				//on success; resolve
				deferred.resolve(data);
			})
			.error(function(data){
				//else reject :D
				deferred.reject(data);
			});
			//return data recieved
			return deferred.promise;
		}

		// Xyrus
		// 3 AddClass (class object, username)
		// - Add a class for teacher 'username'
		//di ko po alam kung pano gagamitin yung username
		function AddClass(newClass, username){
			var deferred = $q.defer();
			var completeUrl = url + "/class";
			newClass.tusername = username;

			$http.post(completeUrl, newClass)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		// 4 AddStudent (student object, courseno, lecturesection)
		// - Add a student in a class(courseno, lecturesection) that belongs to teacher 'username'
		function AddStudent(newStudent) {
			var deferred = $q.defer();
			var completeUrl = url + "/student";

			$http.post(completeUrl, newStudent)
			.success(function (data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}



		// 5 GetClass(courseno, lecturesection, username)
		// - Get a specific Class that belongs to teacher 'username'		  		// - Get a specific Class that belongs to teacher 'username'
		function GetClass(courseno, lecturesection, username){
			var deferred = $q.defer(); //expose promise
			var completeUrl = url + "/class/"+username+"/"+courseno+"/"+lecturesection;

			$http.get(completeUrl)
			.success(function(data){
				//on success; resolve
				deferred.resolve(data);
			})
			.error(function(data){
				//else reject
				deferred.reject(data);
			});
			//return data received
			return deferred.promise;

		}

		function UploadToUrl(file, studentno, courseno, lecturesection){
			var completeUrl = url + "/student-picture/"+studentno+"/"+courseno+"/"+lecturesection;
			var fd = new FormData();
			var deferred = $q.defer();
			fd.append('file', file);

			$http.post(completeUrl, fd, {
				transformRequest: angular.identity,
			//	headers: {'Content-Type': 'multipart/form-data'}
				headers: {'Content-Type': undefined }
			})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function (data){
				deferred.reject(data);
			});
			return deferred.promise;
		}



		/* Team Von Neumann */
		// 1 GetAllClasses(username)
		// - get all class(es) that belong(s) to teacher 'username'

		// 2 GetAllStudentsInClass(username, courseno, lecturesection)
		// - get all students in a specific class(courseno, lecturesection) that belongs to teacher 'username'

		// 3 AddClass (class object, username)
		// - Add a class for teacher 'username'

		// 4 AddStudent (student object, courseno, lecturesection)
		// - Add a student in a class(courseno, lecturesection) that belongs to teacher 'username'

		// 5 GetClass(courseno, lecturesection, username)
		// - Get a specific Class that belongs to teacher 'username'

		// 6 GetStudent(courseno, lecturesection, studentno)
		// - Get a specific Student in a class

		/************* Team Turing Task #3 *************/
		// Homer
		// 7 GetAllStudentsInSection(courseno, lecturesection, lrsection)
		// - Get all students in a specific lab/recit section in a class
		// function GetAllStudentsInSection(courseno, lecturesection, lrsection){
		// 	var deferred = $q.defer(); //expose promise
		// 	var completeUrl = url + "/student-section/"+courseno+"/"+lecturesection+"/"+lrsection;
		//
		// 	$http.get(completeUrl)
		// 	.success(function(data){
		// 		//on success; resolve
		// 		deferred.resolve(data);
		// 	})
		// 	.error(function(data){
		// 		//else reject :D
		// 		deferred.reject(data);
		// 	});
		// 	//return data recieved
		// 	return deferred.promise;
		// }
		//
		// 8 EditStudent(student object, courseno, lecturesection, studentno)
		// - Edit a student from a specific class
		function EditStudent(updatedStudent, courseno, lecturesection, studentno){
			var deferred = $q.defer(); //expose promise
			//var completeUrl = [url, "_student.update"];
			var completeUrl = url + "/student/"+studentno+"/"+courseno+"/"+lecturesection;
			$http.put(completeUrl, updatedStudent)
			.success(function(data){
				//on success; resolve
				deferred.resolve(data);
			})
			.error(function(data){
				//else reject :D
				deferred.reject(data);
			});
			//return data recieved
			return deferred.promise;
		}


		// Sarah
		// 9 EditClass(class object, courseno, lecturesection, username)
		// - Edit a class that belongs to teacher 'username'
		function EditClass(updatedClass, courseno, lecturesection, username) {
			var deferred = $q.defer();
			var completeUrl = url + "/class/"+username+"/"+courseno+"/"+lecturesection;

			$http.put(completeUrl, updatedClass)
			.success(function(data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			//return data received
			return deferred.promise;
		}
		//
		// // 10 RemoveStudent(courseno, lecturesection, studentno)
		// // - Remove a student in a class
		function RemoveStudent(courseno, lecturesection, studentno) {
			var deferred = $q.defer();
		 	var completeUrl = url + "/student";

		 	var studentInfo = {
		 		studentno:'',
		 		courseno:'',
		 		lecturesection:''
		 	};

		 	studentInfo.courseno = courseno;
		 	studentInfo.lecturesection = lecturesection;
		 	studentInfo.studentno = studentno;

		 	$http.delete([completeUrl, studentno, courseno, lecturesection].join("/"))
		 	.success(function(data) {
		 		deferred.resolve(data);
		 	})
			.error(function (data) {
		 		deferred.reject(data);
		 	});
		 	//return data received
		 	return deferred.promise;
		 }
		//
		// Fritz
		// 11 RemoveClass(courseno, lecturesection, username)
		//- Remove a class that belongs to teacher 'username'
		function RemoveClass(courseno, lecturesection, username){

			var deferred = $q.defer();
			var completeUrl = url + "/class";

			$http.delete([completeUrl, username, courseno, lecturesection].join("/"))
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		// // Michael
		// // 13 EditTeacher()
		 function EditTeacher(updatedTeacher) {
		 	var deferred = $q.defer();
		 	var completeUrl = url + "/teacher/"+updatedTeacher.username;

			// make some http request - PUT
		 	// updatedTeacher (JSON) as Body for the http request
		 	$http.put(completeUrl, updatedTeacher)
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }
		// // 14 UpdateTeacherPassword()
		 function UpdateTeacherPassword(updatedPassword, username) {
		 	var deferred = $q.defer();
		 	var completeUrl = url + "/teacher-password/"+username;

		 	// make some http request - PUT
		 	// updatedPassword (JSON) as Body for the http request
		 	$http.put(completeUrl, {password:updatedPassword})
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }

		 function FindTeacher(username){
		 	var deferred = $q.defer();
		 	var completeUrl = url + "/teacher/"+username;

			// make some http request - GET
			// finds one teacher
		 	$http.get(completeUrl)
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }

		 function RemoveAllStudents(courseno, lecturesection){
		 	var deferred = $q.defer();
		 	var completeUrl = url + '/student-class/'+courseno+'/'+lecturesection+'/';

		 	$http.delete(completeUrl)
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }

		 function AddLog(log) {
			 var deferred = $q.defer();
 		 	var completeUrl = url + '/log';

 		 	$http.post(completeUrl, log)
 		 	.success(function (data) {
 		 		deferred.resolve(data);
 		 	})
 		 	.error(function (data) {
 		 		deferred.reject(data);
 		 	});

 		 	return deferred.promise;
		 }

		 function RemoveAllHistory(courseno, lecturesection){
		 	var deferred = $q.defer();
		 	var completeUrl = url + '/log/'+courseno+'/'+lecturesection+'/';

		 	$http.delete(completeUrl)
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }

		 function ChangeColorScheme(username, color){
		 	var deferred = $q.defer();
		 	var completeUrl = url + '/teacher-color/'+username;

		 	$http.put(completeUrl, {colorScheme:color})
		 	.success(function (data) {
		 		deferred.resolve(data);
		 	})
		 	.error(function (data) {
		 		deferred.reject(data);
		 	});

		 	return deferred.promise;
		 }
		//
		// /************ end of Team Turing T3 ************/

		// KIDD
		function GetHistory(courseno, lecturesection) {
			var deferred = $q.defer();
			var completeUrl = url + "/log/" + courseno + "/" + lecturesection;
			$http.get(completeUrl)
			.success(function(res){
				deferred.resolve(res);
			})
			.error(function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function randomizeSeat(n, courseno, lecturesection) {
			var deferred = $q.defer();
			var completeUrl = url + "/randomizeSeat/" + n + "/" + courseno + "/" + lecturesection;
			$http.get(completeUrl)
			.success(function (data) {
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		function UpdateTeacherUsername(updatedUsername, username) {
		     var deferred = $q.defer();
		     var completeUrl = url + "/teacher-username/"+username;

		     // make some http request - PUT
		     // updatedUsername (JSON) as Body for the http request
		     $http.put(completeUrl, {username:updatedUsername})
		     .success(function (data) {
			     deferred.resolve(data);
		     })
		     .error(function (data) {
			     deferred.reject(data);
		     });

		     return deferred.promise;
		}

		service.GetUsername = GetUsername;
		service.GetAllClasses = GetAllClasses;
		service.GetAllStudentsInClass = GetAllStudentsInClass;
		service.AddClass = AddClass;
		service.AddStudent = AddStudent;
		service.GetClass = GetClass;
		service.UploadToUrl = UploadToUrl;
		service.EditClass = EditClass;
		service.RemoveStudent = RemoveStudent;
		service.EditStudent = EditStudent;
		service.RemoveClass = RemoveClass;
		service.EditTeacher = EditTeacher;
		service.UpdateTeacherPassword = UpdateTeacherPassword;
		service.FindTeacher = FindTeacher;
		service.GetHistory = GetHistory;
		service.RemoveAllStudents = RemoveAllStudents;
		service.RemoveAllHistory = RemoveAllHistory;
		service.ChangeColorScheme = ChangeColorScheme;
		service.randomizeSeat = randomizeSeat;
		service.UpdateTeacherUsername = UpdateTeacherUsername;
		service.AddLog = AddLog;

		/* RETURN SERVICE */
		return service;
	}


})();
