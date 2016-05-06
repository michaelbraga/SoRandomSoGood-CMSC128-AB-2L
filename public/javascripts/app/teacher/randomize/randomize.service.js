'use strict';
(function () {
	/* Randomize App */
	angular
	.module("TeacherApp")
	/* Randomize Service Provider */
	.factory("RandomizeService", RandomizeService);

	RandomizeService.$inject = ["$http", "$q"];

	function RandomizeService($http, $q) {
		var url = document.location.origin + "/api-user";
		var service = {};

		/* SERVICES */
		function randomizeFunction(n, section, sex, batch, college, degreeProgram, courseno, lecturesection) {
			var deferred = $q.defer();
			//var completeUrl = [url, "randomize", n, section, sex, batch, college, degreeProgram];
			var completeUrl = url + "/randomize/";
			if(n==undefined||n=="") completeUrl += "none/";
			else completeUrl += n + "/";
			if(section==undefined||section=="") completeUrl += "none/";
			else completeUrl += section + "/";
			if(sex==undefined||sex=="") completeUrl += "none/";
			else completeUrl += sex + "/";
			if(batch==undefined||batch=="") completeUrl += "none/";
			else completeUrl += batch + "/";
			if(college==undefined||college=="") completeUrl += "none/";
			else completeUrl += college + "/";
			if(degreeProgram==undefined||degreeProgram=="") completeUrl += "none/";
			else completeUrl += degreeProgram + "/";
			if(courseno==undefined||courseno=="") completeUrl += "none/";
			else completeUrl += courseno + "/";
			if(lecturesection==undefined||lecturesection=="") completeUrl +="none";
			else completeUrl += lecturesection;

			//var completeUrl = url + "/randomize";
			$http.get(completeUrl)
			.success(function (data) {
				console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function buroFunction(courseno, lecturesection, N, nRemaining){
			var deferred = $q.defer();
			if(nRemaining<0) nRemaining = 0;
			var completeUrl = url + "/buro/" + courseno + "/" + lecturesection + "/" + N + "/" + nRemaining;

			$http.get(completeUrl)
			.success(function (data) {
				console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function getLrSections(courseno, lecturesection){
			var deferred = $q.defer();

			var completeUrl = url + "/lrsection/";

			completeUrl+=courseno + "/" + lecturesection;

			$http.get(completeUrl)
			.success(function (data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		function showStudentsbyLrSectionFunction(courseno, lecturesection, lrsection){
			var deferred = $q.defer();

			var completeUrl = url + "/lrsection/";

			completeUrl+=courseno + "/" + lecturesection + "/" + lrsection;

			$http.get(completeUrl)
			.success(function (data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function updatePriority(studentno, courseno, lecturesection, lrsection, p){
			var deferred = $q.defer();

			var completeUrl = url + "/buro/";

			completeUrl+=courseno + "/" + lecturesection + "/" + lrsection + "/" + studentno + "/" + p;

			$http.put(completeUrl)
			.success(function (data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function addLog(cno, lsec, stdno){
			var deferred = $q.defer();
			var loglog = {courseno : cno, lecturesection: lsec, studentno: stdno};
			var completeUrl = url + "/randLog";
			$http.post(completeUrl, loglog)
			.success(function (data) {
				//console.log(data);
				deferred.resolve(data);
			})
			.error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
		function GetNumberOfStudents(courseno, lecturesection) {
			var deferred = $q.defer(); //expose promise
			var completeUrl = url + "/number-of-students/"+courseno+"/"+lecturesection;

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
		service.randomizeFunction = randomizeFunction;
		service.buroFunction = buroFunction;
		service.getLrSections = getLrSections;
		service.showStudentsbyLrSectionFunction = showStudentsbyLrSectionFunction;
		service.updatePriority = updatePriority;
		service.addLog = addLog;
		service.GetNumberOfStudents = GetNumberOfStudents;

		/* RETURN SERVICE */
		return service;
	}


})();
