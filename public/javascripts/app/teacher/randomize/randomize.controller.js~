'use strict';

$(document).ready(function () {

});

(function () {
	// Randomize App
	angular
	.module("TeacherApp", [])
	// Randomize Controller
	.controller("RandomizeCtrl", RandomizeCtrl);

	// Inject dependencies to controller --------------------
	// $scope - for manipulating data in view
	// $window - for page redirection
	// RandomizeService - for asynchronous functions
	RandomizeCtrl.$inject = ["$scope", "$window", "RandomizeService"];

	/**************************
		RANDOM CONTROLLER
	**************************/
	function RandomizeCtrl($scope, $window, RandomizeService){

		// function that will handle login
		$scope.studentNames = [];
		$scope.studentNames2 = [];
		$scope.N;
		var ifburo = false;
		var N = 0;
		var courseno = $('#courseno').html().trim();
		//console.log(courseno);
		var lecturesection = $('#lecturesection').html().trim();
		RandomizeService.getLrSections(courseno, lecturesection)
			// if successful or status code == 200
			.then(function (res) {
					$scope.lrSectionList = res;
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				alert(res.message);
			});
		var lr = 1;
		RandomizeService.showStudentsbyLrSectionFunction(courseno, lecturesection, lr)
			// if successful or status code == 200
			.then(function (res) {
				$scope.studentNamesInLrSection = res;
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				alert(res.message);
			});
		RandomizeService.GetNumberOfStudents(courseno, lecturesection)
			.then(function (res) {
				console.log(res);
				$scope.no_students = res.no_students;
			})
			.catch(function (res) {
				console.log(res);
			});
		$scope.promptOkay = function () {
			Materialize.toast("Options are saved!", 2000, 'rounded');
		}
		$scope.showStudentsbyLrSection = function(sec){
			//console.log(sec.lrsection);
			RandomizeService.showStudentsbyLrSectionFunction(courseno, lecturesection, sec.lrsection)
			// if successful or status code == 200
			.then(function (res) {
				$scope.studentNamesInLrSection = res;
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				alert(res.message);
			});
		}
		$scope.randomize = function () {

			if($scope.N>0){
				N = $scope.N;
			}

			if($scope.N<=0){
				Materialize.toast('N value is should be greater than 0', 4000);
				N = 0;
			}
			else if($scope.N==undefined||$scope.N==""){
				Materialize.toast('Invalid value of N', 4000);
				N = 0;
			}
			else if(ifburo==false){
					RandomizeService.randomizeFunction($scope.N, $scope.section, $scope.sex, $scope.batch, $scope.college, $scope.degreeProgram, courseno, lecturesection)
					// if successful or status code == 200
					.then(function (res) {
							$scope.randomizedStudents = res;
							for(var i=0;i<$scope.randomizedStudents.length;i++){
								RandomizeService.addLog(courseno, lecturesection, $scope.randomizedStudents[i].studentno)
									.then(function (res) {

									})
									// if failure or status code = 404, 401, etc.
									.catch(function (res) {
										alert(res.message);
									});
							}
					})
					// if failure or status code = 404, 401, etc.
					.catch(function (res) {
						alert(res.message);
					});
			}
			else if(ifburo==true){
				for(var i=0;i<$scope.studentNames.length;i++){
					RandomizeService.updatePriority($scope.studentNames[i].studentno, courseno, lecturesection, $scope.studentNames[i].lrsection, 1)
						.then(function (res) {

						})
						// if failure or status code = 404, 401, etc.
						.catch(function (res) {
							alert(res.message);
						});
				}
				for(var i=0;i<$scope.studentNames2.length;i++){
					RandomizeService.updatePriority($scope.studentNames2[i].studentno, courseno, lecturesection, $scope.studentNames2[i].lrsection, 2)
						.then(function (res) {

						})
						// if failure or status code = 404, 401, etc.
						.catch(function (res) {
							alert(res.message);
						});
				}
				RandomizeService.buroFunction(courseno, lecturesection, N, N-$scope.studentNames.length)
				.then(function (res) {
					$scope.randomizedStudents = res;
					for(var j=0;j<$scope.randomizedStudents.length;j++){
						RandomizeService.addLog(courseno, lecturesection, $scope.randomizedStudents[j].studentno)
							.then(function (res) {

							})
							// if failure or status code = 404, 401, etc.
							.catch(function (res) {
								alert(res.message);
							});
					}
					for(var i=0;i<$scope.studentNames.length;i++){
						RandomizeService.updatePriority($scope.studentNames[i].studentno, courseno, lecturesection, $scope.studentNames[i].lrsection, 0)
							.then(function (res) {

							})
							// if failure or status code = 404, 401, etc.
							.catch(function (res) {
								alert(res.message);
							});
					}
					for(var i=0;i<$scope.studentNames2.length;i++){
						RandomizeService.updatePriority($scope.studentNames2[i].studentno, courseno, lecturesection, $scope.studentNames2[i].lrsection, 0)
							.then(function (res) {

							})
							// if failure or status code = 404, 401, etc.
							.catch(function (res) {
								alert(res.message);
							});
					}
				})
				// if failure or status code = 404, 401, etc.
				.catch(function (res) {
					alert(res.message);
				});
			}
		}
		$scope.addNamesToTable = function(student){
			if($scope.studentNames.indexOf(student)==-1 && $scope.studentNames2.indexOf(student)==-1){
				$scope.studentNames.push(student);
			}
			else{
				Materialize.toast('Student is already chosen', 4000);
			}
		}
		$scope.addNamesToTable2 = function(student){
			if($scope.studentNames2.indexOf(student)==-1 && $scope.studentNames.indexOf(student)==-1){
				$scope.studentNames2.push(student);
			}
			else{
				Materialize.toast('Student is already chosen', 4000);
			}
		}
		$scope.deleteAName = function(names){
			for(var i=0;i<$scope.studentNames.length;i++){
				if($scope.studentNames[i].fname==names.fname&&$scope.studentNames[i].mname==names.mname&&$scope.studentNames[i].lname==names.lname){
					var ind = $scope.studentNames.indexOf($scope.studentNames[i]);
					if (ind > -1) {
						$scope.studentNames.splice(ind, 1);
					}
				}
			}
		}
		$scope.deleteAName2 = function(names){
			for(var i=0;i<$scope.studentNames2.length;i++){
				if($scope.studentNames2[i].fname==names.fname&&$scope.studentNames2[i].mname==names.mname&&$scope.studentNames2[i].lname==names.lname){
					var ind = $scope.studentNames2.indexOf($scope.studentNames2[i]);
					if (ind > -1) {
						$scope.studentNames2.splice(ind, 1);
					}
				}
			}
		}
		$scope.buroStudents = function(){
			ifburo = true;
		}
	}

})();
