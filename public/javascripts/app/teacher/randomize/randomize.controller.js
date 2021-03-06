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
		
		//needed variables for randomizing
		$scope.studentNames = [];
		$scope.studentNames2 = [];
		$scope.N;
		$scope.no_students;
		$scope.typewriter = true;
		$scope.walang_students = false;
		var ifburo = false;
		var N = 0;
		var courseno = $('#courseno').html().trim();
		var lecturesection = $('#lecturesection').html().trim();
		
		/* get the recit sections in lecture section */
		
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
		
		/* get the students in a specific recit section and show them in the risk and safe zone and the default recit section to show is recit section 1 */
		
		RandomizeService.showStudentsbyLrSectionFunction(courseno, lecturesection, lr)
			// if successful or status code == 200
			.then(function (res) {
				$scope.studentNamesInLrSection = res;
			})
			// if failure or status code = 404, 401, etc.
			.catch(function (res) {
				alert(res.message);
			});
			
		/* get the number of students in a lecture section */
		
		RandomizeService.GetNumberOfStudents(courseno, lecturesection)
			.then(function (res) {
				$scope.no_students = res.no_students;
				if($scope.no_students==0){
					$scope.typewriter = false;
					$scope.walang_students = true;
				}
			})
			.catch(function (res) {
			});
			
		/* prompt to notifiy the teacher that their options in randomization are saved */
		
		$scope.promptOkay = function () {
			Materialize.toast("Options are saved!", 2000, 'rounded');
		}
		
		/* function for showing students in the recit section clicked by the user */
		
		$scope.showStudentsbyLrSection = function(sec){
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
		
		/* function for the randomization
			The function checks if the user entered a valid value for N.
			The function executes two kinds of randomization:
				1. Randomize function with filters
					- randomized the students according to the filters specified by the user
				2. Randomize function with risk and safe zone
					- randomize the students depending on the students included in the risk and safe zone
						* risk zone - students in this zone have the 100% chance of being called or randomized
						* safe zone - students in this zone have 0% chance of being called or randomized
			In risk zone and safe zone, the priority attribute of each students dictates if the student will be picked or not by the randomizer
		 */
		
		$scope.randomize = function () {

			if($scope.N>=1&&$scope.N % 1 == 0){
				N = $scope.N;
			}
			if($scope.N<1){
				Materialize.toast('N value should be greater than or equal to 1', 4000);
				N = 0;
			}
			else if($scope.N==undefined||$scope.N==""){
				Materialize.toast('Invalid value of N', 4000);
				N = 0;
			}
			else if($scope.N % 1 != 0){
				Materialize.toast('N should be an integer', 4000);
				N = 0;
			}
			else if(ifburo==false){
					RandomizeService.randomizeFunction(N, $scope.section, $scope.sex, $scope.batch, $scope.college, $scope.degreeProgram, courseno, lecturesection)
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
		
		/*	function for adding student names in risk zone
			the function will only add the student name if the student is not included in the list of students in risk and safe zone
		*/
		
		$scope.addNamesToTable = function(student){
			var check = 0;
			for(var i=0;i<$scope.studentNames.length;i++){
				console.log($scope.studentNames[i].studentno + " " + student.studentno);
				if(student.studentno==$scope.studentNames[i].studentno){
					check = 1;
					break;
				}
			}
			for(var i=0;i<$scope.studentNames2.length;i++){
				console.log($scope.studentNames2[i].studentno + " " + student.studentno);
				if(student.studentno==$scope.studentNames2[i].studentno){
					check = 1;
					break;
				}
			}
			if(check==0){
				$scope.studentNames.push(student);
			}
			else{
				Materialize.toast('Student is already chosen', 4000);
			}
		}
		
		/*	function for adding student names in safe zone
			the function will only add the student name if the student is not included in the list of students in risk and safe zone
		*/
		
		$scope.addNamesToTable2 = function(student){
			var check = 0;
			for(var i=0;i<$scope.studentNames2.length;i++){
				console.log($scope.studentNames2[i].studentno + " " + student.studentno);
				if(student.studentno==$scope.studentNames2[i].studentno){
					check = 1;
					break;
				}
			}
			for(var i=0;i<$scope.studentNames.length;i++){
				console.log($scope.studentNames[i].studentno + " " + student.studentno);
				if(student.studentno==$scope.studentNames[i].studentno){
					check = 1;
					break;
				}
			}
			if(check==0){
				$scope.studentNames2.push(student);
			}
			else{
				Materialize.toast('Student is already chosen', 4000);
			}
		}
		
		/* function for removing a student in risk zone */
		
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
		
		/* function for removing a student in safe zone */
		
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
		
		/* check if the user adds student/s in the risk or buro zone */
		
		$scope.buroStudents = function(){
			if($scope.studentNames.length!=0||$scope.studentNames2.length!=0) ifburo = true;
		}
	}

})();
